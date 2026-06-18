import { useState, useEffect, useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
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
    FaUserNurse,
    FaBars,
    FaTimes
} from 'react-icons/fa';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [theme, setTheme] = useState(() => {
        const stored = localStorage.getItem('theme');
        return stored === 'dark' ? 'dark' : 'light';
    });
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        setShowSidebar(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Función para saber si el link está activo
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="dashboard-layout">
            
            {/* Header móvil superior con hamburguesa */}
            <header className="mobile-header d-md-none d-flex align-items-center justify-content-between p-3 bg-dark text-white border-bottom border-secondary w-100">
                <span className="fw-bold">🏥 Clínica George</span>
                <button 
                    type="button" 
                    className="btn btn-outline-light border-0 p-1" 
                    onClick={() => setShowSidebar(!showSidebar)}
                    aria-label="Alternar menú de navegación"
                    title="Alternar Menú"
                >
                    {showSidebar ? <FaTimes size={22} /> : <FaBars size={22} />}
                </button>
            </header>

            <aside className={`sidebar ${showSidebar ? 'show' : ''}`}>
                <div className="sidebar-logo d-flex justify-content-between align-items-center">
                    <span>🏥 Clínica George</span>
                    <button 
                        type="button"
                        className="btn btn-sm text-white d-md-none border-0 p-1"
                        onClick={() => setShowSidebar(false)}
                        aria-label="Cerrar menú de navegación"
                        title="Cerrar Menú"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>
                
                {/* Day/Night Theme Toggle Switch */}
                <div className="d-flex justify-content-center mb-4">
                    <div 
                        className={`theme-toggle-switch ${theme === 'dark' ? 'dark-mode' : ''}`}
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        title={theme === 'light' ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro"}
                        aria-label="Alternar tema de la aplicación"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { 
                            if (e.key === 'Enter' || e.key === ' ') { 
                                e.preventDefault();
                                setTheme(theme === 'light' ? 'dark' : 'light'); 
                            } 
                        }}
                    >
                        <div className="toggle-track">
                            {/* Nubes for Light Mode */}
                            <div className="toggle-clouds">
                                <div className="cloud cloud-1"></div>
                                <div className="cloud cloud-2"></div>
                            </div>
                            
                            {/* Luna Creciente and Stars for Dark Mode */}
                            <div className="toggle-night-sky">
                                <div className="crescent-moon"></div>
                                <div className="star star-1">✦</div>
                                <div className="star star-2">✦</div>
                                <div className="star star-3">✦</div>
                            </div>
                            
                            {/* White circle (Sun / Moon) */}
                            <div className="toggle-knob"></div>
                        </div>
                    </div>
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

            {/* Backdrop para cerrar sidebar al hacer clic fuera en pantallas móviles */}
            {showSidebar && (
                <div 
                    className="sidebar-backdrop d-md-none" 
                    onClick={() => setShowSidebar(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 998
                    }}
                />
            )}

            {/* CONTENIDO PRINCIPAL */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;