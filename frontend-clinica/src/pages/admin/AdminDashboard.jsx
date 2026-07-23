import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const modules = [
        { title: "Gestión de Personal", description: "Alta, baja y administración de empleados.", link: "/admin/personal", btnClass: "btn-primary" },
        { title: "Farmacia y Medicamentos", description: "Inventario y catálogo de fármacos.", link: "/admin/farmacia", btnClass: "btn-success" },
        { title: "Laboratorio y Análisis", description: "Tipos de análisis y servicios disponibles.", link: "/admin/laboratorio", btnClass: "btn-warning" },
        { title: "Consultorios y Horarios", description: "Infraestructura y programación de turnos.", link: "/admin/programacion", btnClass: "btn-info" },
    ];

    return (
        <Container className="mt-4">
            <div className="page-header">
                <h2>Panel de Administración</h2>
                <p>Gestión centralizada del centro médico.</p>
            </div>
            <Row className="g-3">
                {modules.map((mod, idx) => (
                    <Col md={6} lg={3} key={idx}>
                        <Card className="h-100 border-0">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                    <h5 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, marginBottom: 'var(--space-sm)' }}>
                                        {mod.title}
                                    </h5>
                                    <p className="text-muted" style={{ fontSize: '0.8125rem' }}>
                                        {mod.description}
                                    </p>
                                </div>
                                <Link to={mod.link} className={`btn ${mod.btnClass} btn-sm mt-3`}>
                                    Gestionar
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default AdminDashboard;