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

    useEffect(() => {
        const handleKeyDownGlobal = (e) => {
            if (e.key === 'Escape' && showSidebar) {
                setShowSidebar(false);
            }
        };
        window.addEventListener('keydown', handleKeyDownGlobal);
        return () => window.removeEventListener('keydown', handleKeyDownGlobal);
    }, [showSidebar]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleKeyDownTheme = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
        }
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="dashboard-layout">
            
            {/* Mobile header (320px+) */}
            <header className="mobile-header d-md-none">
                <span className="mobile-header-title">Centro Médico</span>
                <button 
                    type="button" 
                    className="hamburger-btn"
                    onClick={() => setShowSidebar(!showSidebar)}
                    aria-label="Abrir menú de navegación"
                    aria-expanded={showSidebar}
                    title="Abrir Menú"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>

            {/* TABLERO IZQUIERDO / SIDEBAR (EXCLUSIVO CONTENEDOR DEL CONTROL DE TEMA) */}
            <aside className={`sidebar ${showSidebar ? 'show' : ''}`} aria-label="Navegación principal">
                <div className="sidebar-logo d-flex justify-content-between align-items-center">
                    <span>Centro Médico</span>
                    <button 
                        type="button"
                        className="btn btn-sm d-md-none border-0 p-1"
                        onClick={() => setShowSidebar(false)}
                        aria-label="Cerrar menú de navegación"
                        title="Cerrar Menú"
                        style={{ color: 'var(--sidebar-text)', background: 'none', minHeight: '36px' }}
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
                            <Link to="/recepcion/pacientes" className={`nav-link-modern ${isActive('/recepcion/pacientes')}`}>
                                Pacientes
                            </Link>
                        </>
                    )}

                </nav>

                {/* FOOTER DEL SIDEBAR: UBICACIÓN EXCLUSIVA Y ELEGANTE DEL SELECTOR DE TEMA */}
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

                    {/* SELECTOR DE MODO CLARO / OSCURO (ÚNICO Y EXCLUSIVO EN TODA LA INTERFAZ) */}
                    <div
                        role="switch"
                        tabIndex={0}
                        aria-checked={theme === 'dark'}
                        aria-label="Cambiar entre modo claro y modo oscuro"
                        className="theme-switch-control"
                        onClick={toggleTheme}
                        onKeyDown={handleKeyDownTheme}
                        title={theme === 'light' ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro"}
                    >
                        <div className="d-flex align-items-center gap-2">
                            {theme === 'light' ? (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5"/>
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                                </svg>
                            ) : (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                </svg>
                            )}
                            <span className="theme-switch-label">
                                {theme === 'light' ? 'Modo claro' : 'Modo oscuro'}
                            </span>
                        </div>

                        <span className="theme-switch-badge">
                            {theme === 'light' ? 'Claro' : 'Oscuro'}
                        </span>
                    </div>

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