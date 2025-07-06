// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const ProtectedRoute = () => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1';
  // console.log('Backend URL:', backendUrl);

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      // console.log('Verifying user authentication...');
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

    verifyUser();
  }, []);

  // console.log(authenticated)

  if (loading) return <div className='loader'></div>;

  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};
