import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const modules = [
        { title: "Gestión de Personal", description: "Alta, baja y administración de empleados.", link: "/admin/personal", btnClass: "btn-primary", ariaLabel: "Ir a la gestión de personal" },
        { title: "Farmacia y Medicamentos", description: "Inventario y catálogo de fármacos.", link: "/admin/farmacia", btnClass: "btn-success", ariaLabel: "Ir a la gestión de farmacia" },
        { title: "Laboratorio y Análisis", description: "Tipos de análisis y servicios disponibles.", link: "/admin/laboratorio", btnClass: "btn-warning", ariaLabel: "Ir a la gestión de laboratorio" },
        { title: "Consultorios y Horarios", description: "Infraestructura y programación de turnos.", link: "/admin/programacion", btnClass: "btn-info", ariaLabel: "Ir a la gestión de infraestructura y consultorios" },
    ];

    return (
        <Container fluid className="p-0">
            <header className="page-header">
                <h1>Panel de Administración</h1>
                <p>Gestión centralizada del centro médico.</p>
            </header>

            <section aria-label="Módulos de administración clínica">
                <Row className="g-3">
                    {modules.map((mod, idx) => (
                        <Col md={6} lg={3} key={idx}>
                            <Card as="article" className="h-100 border-0">
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <div>
                                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, marginBottom: 'var(--space-sm)' }}>
                                            {mod.title}
                                        </h2>
                                        <p className="text-secondary" style={{ fontSize: '0.8125rem' }}>
                                            {mod.description}
                                        </p>
                                    </div>
                                    <Link to={mod.link} className={`btn ${mod.btnClass} btn-sm mt-3`} aria-label={mod.ariaLabel}>
                                        Gestionar
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>
        </Container>
    );
};

export default AdminDashboard;