import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { profile } from '@/data/profile';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, _honeypot } = body;

    // 1. Honeypot check for spam protection
    // If the hidden field is filled out, silently return a success response
    if (_honeypot) {
      console.log('Spam bot detected via honeypot');
      return NextResponse.json({ success: true, message: 'Message sent successfully' });
    }

    // 2. Server-side validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ success: false, error: 'name field is required' }, { status: 400 });
    }
    
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'valid email field is required' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ success: false, error: 'message field is required' }, { status: 400 });
    }

    // 3. Send email using Resend
    // In development or if API key is missing/placeholder, we might just log it
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is not set. Simulating successful email send for:', { name, email, message });
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ success: true, message: 'Message sent successfully (simulated)' });
    }

    const data = await resend.emails.send({
      from: process.env.SENDER_EMAIL || 'Portfolio Contact <onboarding@resend.dev>', // Resend's default testing domain
      to: [process.env.CONTACT_EMAIL || profile.email],
      subject: `New Contact Request from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (data.error) {
      console.error('Resend error:', data.error);
      return NextResponse.json({ success: false, error: 'failed to send email via resend' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ success: false, error: 'internal server error' }, { status: 500 });
  }
}
