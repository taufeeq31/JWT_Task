import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/dashboard/Dashboard';
import Signup from '../pages/auth/Signup';
import Login from '../pages/auth/Login';

const Private = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;
    return children;
};

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Navigate to="/login" replace />} />
                <Route path="/*" element={<Navigate to="/" replace />} />
                <Route
                    path="/"
                    element={
                        <Private>
                            <Dashboard />
                        </Private>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
