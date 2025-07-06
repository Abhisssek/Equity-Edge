// src/AppRouter.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../routers/ProtectedRoute';
import { PublicRoute } from '../routers/PublicRoute';


import {Home} from '../components/home/Home';
import { Login } from '../components/login/Login';
import { Register } from '../components/register/Register';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}

        {/* Guest-only routes */}
        <Route element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
