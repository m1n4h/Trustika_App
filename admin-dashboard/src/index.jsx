import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import BackendLogin from './BackendLogin';

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test backend connection
    fetch(`${import.meta.env.VITE_API_BASE_URL}/health`)
      .then(res => res.json())
      .then(data => {
        console.log('Backend health check:', data);
        setStats({ users: 150, vendors: 25, restaurants: 18, riders: 12 });
        setLoading(false);
      })
      .catch(err => {
        console.error('Backend connection error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Welcome to Trustika Admin Dashboard!</p>
          <pre>{JSON.stringify(stats, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) {
    return <BackendLogin onLogin={setUser} />;
  }

  return <DashboardHome />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
