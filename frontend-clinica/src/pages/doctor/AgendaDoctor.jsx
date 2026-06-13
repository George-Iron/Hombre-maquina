import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- 1. IMPORTAR HOOK
import api from '../../config/axios';
import { Container, Table, Badge, Button, Card, Alert } from 'react-bootstrap';

const AgendaDoctor = () => {
    const navigate = useNavigate(); // <--- 2. INICIALIZAR HOOK
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Función para obtener la fecha de hoy en formato YYYY-MM-DD
    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const hoy = getTodayDate();
                // LLAMADA AL BACKEND REAL
                const response = await api.get(`/cita/agenda?fecha=${hoy}`);
                setCitas(response.data);
            } catch (err) {
                console.error(err);
                setError('No se pudo cargar la agenda.');
            } finally {
                setLoading(false);
            }
        };

        fetchCitas();
    }, []);

    // Función para ir a la pantalla de atención
    const handleAtender = (idCita) => {
        // <--- 3. LÓGICA DE NAVEGACIÓN
        // Redirige a la ruta definida en App.js: /medico/atencion/:idCita
        navigate(`/medico/atencion/${idCita}`);
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4 text-primary">Agenda del Día ({getTodayDate()})</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <p>Cargando pacientes...</p>
            ) : (
                <Card className="shadow-sm">
                    <Card.Body>
                        {citas.length === 0 ? (
                            <Alert variant="info">No hay citas programadas para hoy.</Alert>
                        ) : (
                            <Table hover responsive className="align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Hora</th>
                                        <th>Paciente</th>
                                        <th>Estado de Pago</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {citas.map((cita) => (
                                        <tr key={cita.idCita}>
                                            <td>{cita.horaCita}</td>
                                            <td className="fw-bold">{cita.nombrePaciente}</td>
                                            <td>
                                                {/* LÓGICA VISUAL DEL SEMÁFORO */}
                                                {cita.estado === 'PAGADA' ? (
                                                    <Badge bg="success" className="p-2">PAGADA ✅</Badge>
                                                ) : (
                                                    <Badge bg="danger" className="p-2">PENDIENTE ❌</Badge>
                                                )}
                                            </td>
                                            <td>
                                                {/* LÓGICA DE BLOQUEO */}
                                                <Button 
                                                    variant={cita.estado === 'PAGADA' ? "primary" : "secondary"}
                                                    size="sm"
                                                    disabled={cita.estado !== 'PAGADA'}
                                                    onClick={() => handleAtender(cita.idCita)}
                                                >
                                                    {cita.estado === 'PAGADA' ? "Atender Paciente" : "Debe Pagar"}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default AgendaDoctor;