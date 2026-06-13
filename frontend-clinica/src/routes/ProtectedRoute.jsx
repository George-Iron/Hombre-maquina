import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        // Si no está logueado, mandar al Login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.rol)) { // Asumiendo que el JWT trae campo "rol"
        // Si está logueado pero no tiene permiso (Ej: Cajero queriendo entrar a Médico)
        return <Navigate to="/unauthorized" replace />;
    }

    // Si pasa todas las pruebas, renderizar la ruta hija
    return <Outlet />;
};

export default ProtectedRoute;