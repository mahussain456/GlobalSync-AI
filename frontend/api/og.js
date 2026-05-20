import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'GlobalSync AI';
    const subtitle = searchParams.get('subtitle') || 'One Platform. Every Time Zone. Total Alignment.';
    const type = searchParams.get('type') || 'default'; // default, time, currency, article

    let icon = '🌍';
    if (type === 'time') icon = '⏱️';
    if (type === 'currency') icon = '💱';
    if (type === 'article') icon = '📝';

    return new ImageResponse(
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div style={{ fontSize: 60, marginRight: '20px' }}>{icon}</div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: '#C8A96A',
                letterSpacing: '-0.02em',
              }}
            >
              GlobalSync AI
            </div>
          </div>
          
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#F4EFE6',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              marginBottom: '30px',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          
          <div
            style={{
              fontSize: 36,
              fontWeight: 500,
              color: '#A7BFAE',
              maxWidth: '800px',
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
