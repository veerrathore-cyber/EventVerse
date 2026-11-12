import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Agar token nahi hai, toh seedha Login page par fenk do
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Agar page sirf admin ke liye hai, par user admin nahi hai, toh Home par fenk do
    if (adminOnly && role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // Agar sab sahi hai, toh page khulne do
    return children;
};

export default ProtectedRoute;