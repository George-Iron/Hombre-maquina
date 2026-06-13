import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { 
    FaUserMd, 
    FaClinicMedical, 
    FaPills, 
    FaVials, 
    FaSignOutAlt, 
    FaHome, 
    FaUserCog,
    FaMoneyBillWave,
    FaCalendarCheck,
    FaUserNurse 
} from 'react-icons/fa';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Función para saber si el link está activo
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="dashboard-layout">
            
            <aside className="sidebar">
                <div className="sidebar-logo">
                    🏥 Clínica George
                </div>
                
                <nav className="d-flex flex-column flex-grow-1">
                    {/* INICIO  */}
                    <Link to="/" className={`nav-link-modern ${isActive('/')}`}>
                        <FaHome className="nav-icon"/> Inicio
                    </Link>

                    {/* MENÚ ADMIN */}
                    {user?.rol === 'ADMIN' && (
                        <>
                            <div className="text-uppercase small text-muted mt-3 mb-2 px-2">Administración</div>
                            <Link to="/admin/personal" className={`nav-link-modern ${isActive('/admin/personal')}`}>
                                <FaUserCog className="nav-icon"/> Personal
                            </Link>
                            <Link to="/admin/programacion" className={`nav-link-modern ${isActive('/admin/programacion')}`}>
                                <FaClinicMedical className="nav-icon"/> Infraestructura
                            </Link>
                            <Link to="/admin/farmacia" className={`nav-link-modern ${isActive('/admin/farmacia')}`}>
                                <FaPills className="nav-icon"/> Farmacia
                            </Link>
                            <Link to="/admin/laboratorio" className={`nav-link-modern ${isActive('/admin/laboratorio')}`}>
                                <FaVials className="nav-icon"/> Laboratorio
                            </Link>
                        </>
                    )}

                    {/* MENÚ DOCTOR */}
                    {['DOCTOR', 'ADMIN'].includes(user?.rol) && (
                        <>
                            <div className="text-uppercase small text-muted mt-3 mb-2 px-2">Área Médica</div>
                            <Link to="/medico/agenda" className={`nav-link-modern ${isActive('/medico/agenda')}`}>
                                <FaUserMd className="nav-icon"/> {user?.rol === 'ADMIN' ? 'Agenda Médica' : 'Mi Agenda'}
                            </Link>
                        </>
                    )}

                    {/* MENÚ ENFERMERÍA */}
                    {['ENFERMERA', 'ADMIN'].includes(user?.rol) && (
                        <>
                            <div className="text-uppercase small text-muted mt-3 mb-2 px-2">Triaje</div>
                            <Link to="/enfermeria/triaje" className={`nav-link-modern ${isActive('/enfermeria/triaje')}`}>
                                <FaUserNurse className="nav-icon"/> Signos Vitales
                            </Link>
                        </>
                    )}

                    {/* MENÚ CAJA */}
                    {['CAJERO', 'ADMIN'].includes(user?.rol) && (
                        <>
                            <div className="text-uppercase small text-muted mt-3 mb-2 px-2">Finanzas</div>
                            <Link to="/caja/cobros" className={`nav-link-modern ${isActive('/caja/cobros')}`}>
                                <FaMoneyBillWave className="nav-icon"/> Caja / Cobros
                            </Link>
                        </>
                    )}

                    {/* MENÚ RECEPCIÓN */}
                    {['RECEPCIONISTA', 'ADMIN'].includes(user?.rol) && (
                        <>
                            <div className="text-uppercase small text-muted mt-3 mb-2 px-2">Atención</div>
                            <Link to="/recepcion/citas" className={`nav-link-modern ${isActive('/recepcion/citas')}`}>
                                <FaCalendarCheck className="nav-icon"/> Gestión de Citas
                            </Link>
                        </>
                    )}

                </nav>

                {/* FOOTER DEL SIDEBAR  */}
                <div className="mt-auto pt-3 border-top border-secondary">
                    <div className="d-flex align-items-center mb-3 px-2">
                        <div className="bg-primary rounded-circle text-white d-flex justify-content-center align-items-center" style={{width: 35, height: 35, marginRight: 10}}>
                            {user?.nombre?.charAt(0)}
                        </div>
                        <div style={{fontSize: '0.85rem'}}>
                            <div className="fw-bold text-white">{user?.nombre}</div>
                            <div className="text-muted small">{user?.rol}</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-danger w-100 btn-sm">
                        <FaSignOutAlt className="me-2"/> Salir
                    </button>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;