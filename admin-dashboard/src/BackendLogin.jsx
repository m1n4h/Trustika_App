import React, { useState } from 'react';

const BackendLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('trustika12@45');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';
      const apiUrl = `${baseUrl}/api/v1/auth/admin/login`;
      
      console.log('Attempting to connect to:', apiUrl);
      
      // First check if backend is reachable
      try {
        const healthCheck = await fetch(`${baseUrl}/api/v1/health`);
        const healthData = await healthCheck.json();
        console.log('Backend health check:', healthData);
      } catch (healthErr) {
        console.error('Health check failed:', healthErr);
        setError('Cannot connect to backend. Is the server running on port 4001?');
        setLoading(false);
        return;
      }
      
      // Proceed with login
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.ok || data.success) {
        localStorage.setItem('adminToken', data.token || 'admin-token');
        localStorage.setItem('adminUser', JSON.stringify(data.admin || { 
          email, 
          name: 'Trustika Admin',
          role: 'admin'
        }));
        onLogin(data.admin || { email, name: 'Trustika Admin' });
      } else {
        setError(data.message || 'Login failed. Check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Cannot connect to backend. Is the server running on port 4001?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ 
          marginBottom: '8px', 
          color: '#333',
          fontSize: '28px',
          fontWeight: '600'
        }}>
          Trustika Admin
        </h1>
        <p style={{ 
          marginBottom: '32px', 
          color: '#666',
          fontSize: '14px'
        }}>
          Sign in to manage vendors, orders, and riders.
        </p>
        
        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#555',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#555',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="trustika12@45"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <p style={{
          marginTop: '24px',
          fontSize: '12px',
          color: '#999',
          textAlign: 'center'
        }}>
          Backend: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001'}
        </p>
      </div>
    </div>
  );
};

export default BackendLogin;
