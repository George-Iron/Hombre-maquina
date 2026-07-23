import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const { user } = useContext(AuthContext);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    return (
        <Container fluid className="p-0">
            {/* Hero Section */}
            <div style={{
                padding: 'var(--space-2xl) 0 var(--space-xl)',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: 'var(--space-xl)',
            }}>
                <h1 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.875rem',
                    marginBottom: 'var(--space-sm)',
                }}>
                    {getGreeting()}, {user?.nombre?.split(' ')[0]}
                </h1>
                <p style={{
                    color: 'var(--text-tertiary)',
                    fontSize: '0.9375rem',
                    marginBottom: 'var(--space-sm)',
                }}>
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <span className="badge-clean badge-neutral" style={{ fontSize: '0.75rem' }}>
                    {user?.rol}
                </span>
            </div>

            {/* Quick Access */}
            <h4 className="section-title-bar">Accesos Rápidos</h4>
            
            <Row className="g-3">
                
                {/* TARJETAS ADMIN */}
                {user?.rol === 'ADMIN' && (
                    <>
                        <Col md={6} lg={3}>
                            <Card className="h-100 border-0">
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <div>
                                        <h5 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, marginBottom: 'var(--space-sm)' }}>
                                            Gestionar Personal
                                        </h5>
                                        <p className="text-muted" style={{ fontSize: '0.8125rem' }}>
                                            Alta, baja y consulta de empleados del centro.
                                        </p>
                                    </div>
                                    <Link to="/admin/personal" className="btn btn-primary btn-sm mt-3">
                                        Ir al Panel
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={3}>
                            <Card className="h-100 border-0">
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <div>
                                        <h5 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, marginBottom: 'var(--space-sm)' }}>
                                            Consultorios
                                        </h5>
                                        <p className="text-muted" style={{ fontSize: '0.8125rem' }}>
                                            Infraestructura y programación de turnos.
                                        </p>
                                    </div>
                                    <Link to="/admin/programacion" className="btn btn-outline-secondary btn-sm mt-3">
                                        Configurar
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </>
                )}

                {/* TARJETA DOCTOR */}
                {['DOCTOR', 'ADMIN'].includes(user?.role || user?.rol) && (
                    <Col md={6} lg={4}>
                        <Card className="h-100 border-0">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                    <h5 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, marginBottom: 'var(--space-sm)' }}>
                                        Atención Médica
                                    </h5>
                                    <p className="text-muted" style={{ fontSize: '0.8125rem' }}>
                                        Gestionar pacientes y consultas del día.
                                    </p>
                                </div>
                                <Link to="/medico/agenda" className="btn btn-success btn-sm mt-3">
                                    Ir a Agenda
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* TARJETA CAJERO */}
                {['CAJERO', 'ADMIN'].includes(user?.rol) && (
                    <Col md={6} lg={4}>
                        <Card className="h-100 border-0">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                    <h5 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, marginBottom: 'var(--space-sm)' }}>
                                        Caja y Cobros
                                    </h5>
                                    <p className="text-muted" style={{ fontSize: '0.8125rem' }}>
                                        Gestión de pagos y facturación.
                                    </p>
                                </div>
                                <Link to="/caja/cobros" className="btn btn-warning btn-sm mt-3">
                                    Ir a Caja
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* TARJETA RECEPCIÓN */}
                {['RECEPCIONISTA', 'ADMIN'].includes(user?.rol) && (
                    <Col md={6} lg={4}>
                        <Card className="h-100 border-0">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                    <h5 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, marginBottom: 'var(--space-sm)' }}>
                                        Recepción
                                    </h5>
                                    <p className="text-muted" style={{ fontSize: '0.8125rem' }}>
                                        Agendar citas y admisión de pacientes.
                                    </p>
                                </div>
                                <Link to="/recepcion/citas" className="btn btn-info btn-sm mt-3">
                                    Gestión de Citas
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

            </Row>
        </Container>
    );
};

export default DashboardPage;