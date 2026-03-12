export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F0E8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            color: '#D4A04A',
            fontSize: '20px',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          &#9679;
        </div>
        <p
          style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#1B3A2D',
            marginTop: '16px',
          }}
        >
          Loading outpost...
        </p>
        <style dangerouslySetInnerHTML={{ __html: '@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }' }} />
      </div>
    </div>
  );
}
