import { useState, useEffect, useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

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

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="dashboard-layout">
            
            {/* Mobile header */}
            <header className="mobile-header d-md-none">
                <span className="mobile-header-title">Centro Médico</span>
                <button 
                    type="button" 
                    className="hamburger-btn"
                    onClick={() => setShowSidebar(!showSidebar)}
                    aria-label="Alternar menú de navegación"
                    title="Alternar Menú"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>

            <aside className={`sidebar ${showSidebar ? 'show' : ''}`}>
                <div className="sidebar-logo d-flex justify-content-between align-items-center">
                    <span>Centro Médico</span>
                    <button 
                        type="button"
                        className="btn btn-sm d-md-none border-0 p-1"
                        onClick={() => setShowSidebar(false)}
                        aria-label="Cerrar menú de navegación"
                        title="Cerrar Menú"
                        style={{ color: 'var(--sidebar-text)', background: 'none' }}
                    >
                        ✕
                    </button>
                </div>
                
                <nav className="d-flex flex-column flex-grow-1" style={{ paddingTop: 'var(--space-md)' }}>
                    {/* INICIO */}
                    <Link to="/" className={`nav-link-modern ${isActive('/')}`}>
                        Inicio
                    </Link>

                    {/* MENÚ ADMIN */}
                    {user?.rol === 'ADMIN' && (
                        <>
                            <div className="nav-section-label">Administración</div>
                            <Link to="/admin/personal" className={`nav-link-modern ${isActive('/admin/personal')}`}>
                                Personal
                            </Link>
                            <Link to="/admin/programacion" className={`nav-link-modern ${isActive('/admin/programacion')}`}>
                                Infraestructura
                            </Link>
                            <Link to="/admin/farmacia" className={`nav-link-modern ${isActive('/admin/farmacia')}`}>
                                Farmacia
                            </Link>
                            <Link to="/admin/laboratorio" className={`nav-link-modern ${isActive('/admin/laboratorio')}`}>
                                Laboratorio
                            </Link>
                        </>
                    )}

                    {/* MENÚ DOCTOR */}
                    {['DOCTOR', 'ADMIN'].includes(user?.rol) && (
                        <>
                            <div className="nav-section-label">Área Médica</div>
                            <Link to="/medico/agenda" className={`nav-link-modern ${isActive('/medico/agenda')}`}>
                                {user?.rol === 'ADMIN' ? 'Agenda Médica' : 'Mi Agenda'}
                            </Link>
                        </>
                    )}

                    {/* MENÚ ENFERMERÍA */}
                    {['ENFERMERA', 'ADMIN'].includes(user?.rol) && (
                        <>
                            <div className="nav-section-label">Triaje</div>
                            <Link to="/enfermeria/triaje" className={`nav-link-modern ${isActive('/enfermeria/triaje')}`}>
                                Signos Vitales
                            </Link>
                        </>
                    )}

                    {/* MENÚ CAJA */}
                    {['CAJERO', 'ADMIN'].includes(user?.rol) && (
                        <>
                            <div className="nav-section-label">Finanzas</div>
                            <Link to="/caja/cobros" className={`nav-link-modern ${isActive('/caja/cobros')}`}>
                                Caja / Cobros
                            </Link>
                        </>
                    )}

                    {/* MENÚ RECEPCIÓN */}
                    {['RECEPCIONISTA', 'ADMIN'].includes(user?.rol) && (
                        <>
                            <div className="nav-section-label">Atención</div>
                            <Link to="/recepcion/citas" className={`nav-link-modern ${isActive('/recepcion/citas')}`}>
                                Gestión de Citas
                            </Link>
                        </>
                    )}

                </nav>

                {/* FOOTER DEL SIDEBAR */}
                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">
                            {user?.nombre?.charAt(0)}
                        </div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{user?.nombre}</div>
                            <div className="sidebar-user-role">{user?.rol}</div>
                        </div>
                    </div>
                    <button
                        className="theme-toggle-btn"
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        title={theme === 'light' ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro"}
                        aria-label="Alternar tema de la aplicación"
                    >
                        {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
                    </button>
                    <button onClick={handleLogout} className="btn-logout">
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Backdrop for mobile sidebar */}
            {showSidebar && (
                <div 
                    className="d-md-none" 
                    onClick={() => setShowSidebar(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.4)',
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