'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: '100vh',
          backgroundColor: '#FAF7F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          margin: 0,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
          <div style={{ color: '#D4A04A', fontSize: '20px', marginBottom: '12px' }}>&#9679;</div>
          <h2
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.5rem',
              marginBottom: '16px',
              color: '#1B3A2D',
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#4A5568',
              marginBottom: '32px',
              lineHeight: '1.6',
            }}
          >
            The outpost hit an unexpected error. This usually resolves on retry.
          </p>
          <button
            onClick={() => reset()}
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              padding: '12px 24px',
              border: '1px solid #1B3A2D',
              backgroundColor: 'transparent',
              color: '#1B3A2D',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
