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
                document.body.innerHTML += '<p style="color:red">Error: window.opener is null. Your browser is blocking the popup.</p>';
                return;
              }
              
              const tokenStr = 'authorization:github:success:{"token":"${token}","provider":"github"}';
              
              try {
                // WORKAROUND: If the popup and parent are on the same domain, we can inject a script 
                // directly into the parent window. This forces the message to originate FROM the parent 
                // window itself, guaranteeing a 100% perfect origin match for Decap CMS's strict security check.
                const script = window.opener.document.createElement('script');
                script.textContent = 'window.postMessage(\\'' + tokenStr + '\\', window.location.origin);';
                window.opener.document.body.appendChild(script);
                
                document.body.innerHTML += '<p style="color:green">Token successfully injected into parent window! Closing...</p>';
                setTimeout(function() { window.close(); }, 1500);
              } catch (e) {
                // If they are on different subdomains (cross-origin), fallback to normal postMessage
                try {
                  window.opener.postMessage(tokenStr, "*");
                  window.opener.postMessage('authorization:netlify:success:{"token":"${token}","provider":"github"}', "*");
                  document.body.innerHTML += '<p style="color:orange">Fallback: Used standard postMessage.</p>';
                  setTimeout(function() { window.close(); }, 1500);
                } catch (err) {
                  document.body.innerHTML += '<p style="color:red">Complete failure: ' + err.message + '</p>';
                }
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
