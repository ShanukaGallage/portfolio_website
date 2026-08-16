import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

// Simple in-memory rate limiter (per Node instance)
// Key: IP address, Value: { count, resetTime }
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 3; // max 3 requests
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitCache.get(ip);

  if (!record) {
    rateLimitCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true; // Allowed
  }

  if (now > record.resetTime) {
    // Window expired, reset
    rateLimitCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true; // Allowed
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false; // Rate limited
  }

  record.count += 1;
  return true; // Allowed
}

export async function POST(request: Request) {
  try {
    // Basic IP extraction for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown-ip';

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ success: false, error: 'rate limit exceeded, try again later' }, { status: 429 });
    }

    const body = await request.json();
    const { email, _honeypot } = body;

    // Honeypot check
    if (_honeypot) {
      console.log('Spam bot detected via honeypot in send-resume');
      return NextResponse.json({ success: true, message: 'Resume sent successfully' });
    }

    // Server-side validation
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'valid email field required' }, { status: 400 });
    }

    // Read the PDF file
    const pdfPath = path.join(process.cwd(), 'public', 'Shanuka_Gallage_Resume.pdf');
    let pdfBuffer: Buffer;
    
    try {
      pdfBuffer = fs.readFileSync(pdfPath);
    } catch (err) {
      console.error('Failed to read resume PDF:', err);
      return NextResponse.json({ success: false, error: 'failed to read resume file on server' }, { status: 500 });
    }

    // Send email using Resend
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is not set. Simulating successful resume send for:', { email });
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ success: true, message: 'Resume sent successfully (simulated)' });
    }

    const data = await resend.emails.send({
      from: process.env.SENDER_EMAIL || 'Shanuka Gallage <onboarding@resend.dev>', // Resend's default testing domain
      to: [email],
      subject: `Shanuka Gallage — Resume`,
      text: `Hello,\n\nPlease find my resume attached.\n\nBest regards,\nShanuka Gallage\nhttps://shanukagallage.me`,
      attachments: [
        {
          filename: 'Shanuka_Gallage_Resume.pdf',
          content: pdfBuffer,
        },
      ],
    });

    if (data.error) {
      console.error('Resend error:', data.error);
      return NextResponse.json({ success: false, error: 'failed to send resume via resend' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Resume sent successfully' });
  } catch (error) {
    console.error('Send resume API error:', error);
    return NextResponse.json({ success: false, error: 'internal server error' }, { status: 500 });
  }
}
