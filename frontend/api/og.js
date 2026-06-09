import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

// Truncate text to a max character length, adding ellipsis if needed
function truncate(str, maxLen) {
  if (!str || str.length <= maxLen) return str || '';
  return str.slice(0, maxLen - 1) + '…';
}

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawTitle    = searchParams.get('title')    || 'GlobalSync AI';
    const rawSubtitle = searchParams.get('subtitle') || 'One Platform. Every Time Zone. Total Alignment.';
    const type        = searchParams.get('type')     || 'default'; // default, time, currency, article, blog, tool

    // Truncate to prevent overflow in the 1200×630 canvas
    const title    = truncate(rawTitle,    80);
    const subtitle = truncate(rawSubtitle, 120);

    let icon = '🌍';
    if (type === 'time')     icon = '⏱️';
    if (type === 'currency') icon = '💱';
    if (type === 'article' || type === 'blog') icon = '📝';
    if (type === 'tool')     icon = '🛠️';

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#071A13',
            backgroundImage: 'linear-gradient(145deg, #071A13 0%, #0E2A1F 100%)',
            padding: '80px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Brand row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div style={{ fontSize: 56, marginRight: '20px', lineHeight: 1 }}>{icon}</div>
            <div
              style={{
                fontSize: 38,
                fontWeight: 700,
                color: '#C8A96A',
                letterSpacing: '-0.02em',
              }}
            >
              GlobalSync AI
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 45 ? 56 : 72,
              fontWeight: 800,
              color: '#F4EFE6',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '30px',
              maxWidth: '960px',
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: '#A7BFAE',
              maxWidth: '820px',
              lineHeight: 1.35,
            }}
          >
            {subtitle}
          </div>

          {/* Bottom URL bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 50,
              left: 80,
              right: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                fontSize: 22,
                color: '#C8A96A',
                fontWeight: 600,
                letterSpacing: '0.01em',
                opacity: 0.85,
              }}
            >
              globalsync-ai.com
            </div>
            <div
              style={{
                fontSize: 16,
                color: '#A7BFAE',
                opacity: 0.6,
                fontWeight: 500,
              }}
            >
              Free · No Signup · AI-Powered
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      }
    );

    return imageResponse;
  } catch (e) {
    console.error('[og.js] Failed to generate OG image:', e);
    // Return a redirect to the static logo as a safe fallback
    // rather than exposing error details or returning HTML.
    return new Response(null, {
      status: 302,
      headers: {
        Location: 'https://www.globalsync-ai.com/globalsync-ai-logo-1600x400.png',
        'Cache-Control': 'no-store',
      },
    });
  }
}
