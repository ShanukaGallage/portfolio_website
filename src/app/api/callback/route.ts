import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Missing OAuth credentials' }, { status: 500 });
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await tokenResponse.json();
    
    if (data.error) {
      return new NextResponse(`GitHub OAuth Error: ${data.error_description || data.error}`, { status: 400 });
    }

    const token = data.access_token;
    if (!token) {
      return new NextResponse(`Error: No access_token found in GitHub response. Response was: ${JSON.stringify(data)}`, { status: 400 });
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authenticating...</title>
        </head>
        <body>
          <h2>Authentication successful!</h2>
          <p>Sending token to CMS...</p>
          <script>
            (function() {
              if (!window.opener) {
                document.body.innerHTML += '<p style="color:red">Error: window.opener is null. Your browser is blocking the popup from communicating with the CMS.</p>';
                return;
              }
              
              const message = 'authorization:github:success:{"token":"${token}","provider":"github"}';
              
              try {
                // Send to all possible origins just in case of mismatch
                window.opener.postMessage(message, "https://shanukagallage.me");
                window.opener.postMessage(message, "https://www.shanukagallage.me");
                window.opener.postMessage(message, "http://localhost:3000");
                window.opener.postMessage(message, "*");
                
                document.body.innerHTML += '<p style="color:green">Message sent to parent window. Closing in 2 seconds...</p>';
                setTimeout(function() { window.close(); }, 2000);
              } catch (e) {
                document.body.innerHTML += '<p style="color:red">Error sending postMessage: ' + e.message + '</p>';
              }
            })();
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
