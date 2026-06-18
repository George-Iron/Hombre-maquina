import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// Agregamos FaMoneyBillWave para la tarjeta de finanzas
import { 
    FaUserMd, 
    FaCalendarCheck, 
    FaUsers, 
    FaFileMedical, 
    FaClock, 
    FaUserShield, 
    FaMoneyBillWave 
} from 'react-icons/fa';

const DashboardPage = () => {
    const { user } = useContext(AuthContext);

    // Función para el saludo dinámico
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    return (
        <Container fluid className="p-4">
            {/* SECCIÓN DE BIENVENIDA (HERO SECTION) */}
            <div className="bg-white p-5 rounded-3 shadow-sm mb-5 position-relative overflow-hidden">
                {/* Decoración de fondo */}
                <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '150px', height: '150px', background: 'linear-gradient(45deg, #0056b3, #17a2b8)', borderRadius: '50%', opacity: 0.1 }}></div>
                
                <Row className="align-items-center position-relative">
                    <Col md={8}>
                        <h1 className="display-5 fw-bold text-dark">
                            {getGreeting()}, <span className="text-primary">{user?.nombre?.split(' ')[0]}</span>
                        </h1>
                        <p className="lead text-secondary mt-2">
                            Bienvenido al Sistema de Gestión Clínica. Estás conectado como 
                            <span className="badge bg-light text-dark border ms-2">
                                {user?.rol === 'ADMIN' ? <FaUserShield className="me-1"/> : <FaUserMd className="me-1"/>}
                                {user?.rol}
                            </span>
                        </p>
                        <p className="text-muted">
                            <FaClock className="me-2" />
                            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </Col>
                    <Col md={4} className="text-end d-none d-md-block">
                        <FaFileMedical size={120} className="text-primary opacity-25" />
                    </Col>
                </Row>
            </div>

            {/* ACCESOS RÁPIDOS */}
            <h4 className="mb-4 text-secondary border-start border-4 border-primary ps-3">Accesos Rápidos</h4>
            
            <Row className="g-4">
                
                {/* 1. TARJETAS EXCLUSIVAS DE ADMIN (Gestión interna) */}
                {user?.rol === 'ADMIN' && (
                    <>
                        <Col md={6} lg={3}>
                            <Card className="h-100 border-0 shadow-sm card-modern bg-primary text-white">
                                <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4 text-center">
                                    <FaUsers size={40} className="mb-3 text-white-50" />
                                    <h5>Gestionar Personal</h5>
                                    <Link to="/admin/personal" className="btn btn-light btn-sm mt-3 w-100 fw-bold text-primary">
                                        Ir al Panel
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={3}>
                            <Card className="h-100 border-0 shadow-sm card-modern">
                                <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4 text-center">
                                    <div className="bg-light rounded-circle p-3 mb-3 text-secondary">
                                        <FaFileMedical size={25} />
                                    </div>
                                    <h6 className="text-muted">Infraestructura</h6>
                                    <h5 className="mb-3">Consultorios</h5>
                                    <Link to="/admin/programacion" className="btn btn-outline-secondary btn-sm w-100">
                                        Configurar
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </>
                )}

                {/* 2. TARJETA DOCTOR (Visible para Doctor y Admin) */}
                {['DOCTOR', 'ADMIN'].includes(user?.role || user?.rol) && (
                    <Col md={6} lg={4}>
                        <Card className="h-100 border-0 shadow-sm card-modern border-start border-success border-4">
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h5 className="fw-bold text-dark">Atención Médica</h5>
                                        <p className="text-muted small">Gestionar pacientes y consultas del día.</p>
                                    </div>
                                    <div className="bg-success bg-opacity-10 p-2 rounded text-success">
                                        <FaUserMd size={24} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link to="/medico/agenda" className="btn btn-success w-100">
                                        Ir a Agenda <FaCalendarCheck className="ms-2"/>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* 3. TARJETA CAJERO (Visible para Cajero y Admin) */}
                {['CAJERO', 'ADMIN'].includes(user?.rol) && (
                    <Col md={6} lg={4}>
                        <Card className="h-100 border-0 shadow-sm card-modern border-start border-warning border-4">
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h5 className="fw-bold text-dark">Caja y Cobros</h5>
                                        <p className="text-muted small">Gestión de pagos y facturación.</p>
                                    </div>
                                    <div className="bg-warning bg-opacity-10 p-2 rounded text-warning">
                                        <FaMoneyBillWave size={24} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link to="/caja/cobros" className="btn btn-warning w-100 text-dark">
                                        Ir a Caja <FaMoneyBillWave className="ms-2"/>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* 4. TARJETA RECEPCIÓN (Visible para Recepcionista y Admin) */}
                {['RECEPCIONISTA', 'ADMIN'].includes(user?.rol) && (
                    <Col md={6} lg={4}>
                        <Card className="h-100 border-0 shadow-sm card-modern border-start border-info border-4">
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h5 className="fw-bold text-dark">Recepción</h5>
                                        <p className="text-muted small">Agendar citas y admisión de pacientes.</p>
                                    </div>
                                    <div className="bg-info bg-opacity-10 p-2 rounded text-info">
                                        <FaCalendarCheck size={24} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link to="/recepcion/citas" className="btn btn-info w-100 text-white">
                                        Gestión de Citas <FaCalendarCheck className="ms-2"/>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

            </Row>
        </Container>
    );
};

export default DashboardPage;