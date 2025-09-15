export default function Home() {
  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: 'green' }}>✅ App is running!</h1>
      <p>If you see this, Next.js is working.</p>
      
      <div style={{ marginTop: '30px' }}>
        <h2>Quick Links:</h2>
        <ul>
          <li><a href="/test">Test Page</a></li>
          <li><a href="/upload">Upload</a></li>
          <li><a href="/assets">Assets</a></li>
        </ul>
      </div>
      
      <div style={{ marginTop: '30px', padding: '20px', background: '#f0f0f0' }}>
        <h3>Database Setup:</h3>
        <ol>
          <li>Open Supabase SQL Editor</li>
          <li>Run the SQL from database-setup.sql</li>
          <li>Refresh this page</li>
        </ol>
      </div>
    </div>
  )
}