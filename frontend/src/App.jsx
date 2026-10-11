import React, { useState, useEffect } from 'react';

function App() {
  const [healthStatus, setHealthStatus] = useState({
    loading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    // Ping backend health check endpoint
    fetch('http://localhost:5000/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setHealthStatus({ loading: false, data, error: null });
      })
      .catch((err) => {
        setHealthStatus({ loading: false, data: null, error: err.message });
      });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '720px',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      }}>
        {/* Status Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          color: 'var(--accent-violet)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '20px',
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: healthStatus.data ? '#10B981' : '#F59E0B',
            display: 'inline-block',
          }}></span>
          Issue #1 • Monorepo Foundation Initialized
        </div>

        {/* Project Heading */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          color: '#FFFFFF',
          marginBottom: '12px',
          letterSpacing: '-0.02em',
        }}>
          XSHostel
        </h1>

        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 500,
          color: 'var(--accent-violet)',
          marginBottom: '20px',
        }}>
          Campus Hostel Management System
        </h2>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '1rem',
          lineHeight: '1.7',
          marginBottom: '32px',
        }}>
          Welcome to the full-stack development environment for XSHostel. The monorepo architecture,
          Express REST API, and React frontend have been successfully configured.
        </p>

        {/* Backend Health Check Card */}
        <div style={{
          backgroundColor: 'rgba(10, 15, 29, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px',
          textAlign: 'left',
        }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            marginBottom: '10px',
          }}>
            Backend API Health Status (<code>/api/health</code>)
          </div>

          {healthStatus.loading && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Checking connection to backend server on port 5000...
            </p>
          )}

          {healthStatus.error && (
            <div style={{ color: '#EF4444', fontSize: '0.9rem' }}>
              Backend offline or awaiting server start. Run <code>npm run dev</code> inside <code>backend/</code>.
            </div>
          )}

          {healthStatus.data && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px',
              fontSize: '0.875rem',
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Service</span>
                <strong>{healthStatus.data.service}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Status</span>
                <span style={{ color: '#10B981', fontWeight: 600 }}>{healthStatus.data.status}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Version</span>
                <strong>v{healthStatus.data.version}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Environment</span>
                <strong>{healthStatus.data.environment}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Four-Member Team Distribution Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          textAlign: 'left',
          marginBottom: '28px',
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            padding: '14px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Member 1 (Lead)</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--accent-violet)' }}>Project Setup & Auth</strong>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            padding: '14px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Member 2</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Frontend & UI</strong>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            padding: '14px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Member 3</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Backend & DB</strong>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            padding: '14px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Member 4</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Allocations & Docs</strong>
          </div>
        </div>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '20px',
          margin: 0,
        }}>
          Campus Hostel Management System • Next Step: Issue #2 (Database Architecture & Mongoose Models)
        </p>
      </div>
    </div>
  );
}

export default App;
