// src/components/PublicRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

export const PublicRoute = () => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1';

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      // console.log('Checking user authentication...');
      try {
        const res = await axios.get(`${backendUrl}/auth/protected`, {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        setAuthenticated(res.data.success);
        // console.log('User authenticated:', res.data);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // console.log(authenticated);
  if (loading) return <div className='loader'></div>;

  return authenticated ? <Navigate to="/" /> : <Outlet />;
};
