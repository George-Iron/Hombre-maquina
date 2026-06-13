import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserMd, FaClinicMedical, FaPills, FaVials } from 'react-icons/fa'; // Asegúrate de tener react-icons instalado

const AdminDashboard = () => {
    const modules = [
        { title: "Gestión de Personal", icon: <FaUserMd size={50} />, link: "/admin/personal", color: "primary" },
        { title: "Farmacia & Medicamentos", icon: <FaPills size={50} />, link: "/admin/farmacia", color: "success" },
        { title: "Laboratorio & Análisis", icon: <FaVials size={50} />, link: "/admin/laboratorio", color: "warning" },
        { title: "Consultorios & Horarios", icon: <FaClinicMedical size={50} />, link: "/admin/programacion", color: "info" },
    ];

    return (
        <Container className="mt-5">
            <h2 className="text-secondary mb-4">Panel de Administración</h2>
            <Row>
                {modules.map((mod, idx) => (
                    <Col md={6} lg={3} key={idx} className="mb-4">
                        <Card className={`h-100 text-center border-${mod.color} shadow-sm hover-effect`}>
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                <div className={`text-${mod.color} mb-3`}>
                                    {mod.icon}
                                </div>
                                <Card.Title>{mod.title}</Card.Title>
                                <Link to={mod.link} className={`btn btn-outline-${mod.color} mt-3 stretched-link`}>
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