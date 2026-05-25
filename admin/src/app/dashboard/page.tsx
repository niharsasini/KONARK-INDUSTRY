export default function DashboardPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Konark Admin Dashboard</h1>
      <p style={{ color: '#666', marginTop: '0.5rem' }}>
        Admin panel — full features coming in Phase 5.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginTop: '2rem',
        }}
      >
        {['Products', 'Orders', 'Enquiries', 'Customers'].map((item) => (
          <div
            key={item}
            style={{
              background: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: 8,
              padding: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.875rem', color: '#888' }}>{item}</div>
            <div style={{ fontSize: '2rem', fontWeight: 600, marginTop: '0.5rem' }}>—</div>
          </div>
        ))}
      </div>
    </div>
  );
}
