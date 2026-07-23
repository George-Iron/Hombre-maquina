import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { Container, Table, Badge, Button, Card, Alert } from 'react-bootstrap';

const AgendaDoctor = () => {
    const navigate = useNavigate();
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const hoy = getTodayDate();
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

    const handleAtender = (idCita) => {
        navigate(`/medico/atencion/${idCita}`);
    };

    return (
        <Container className="p-0">
            <div className="page-header">
                <h2>Agenda del Día</h2>
                <p>{getTodayDate()}</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <p style={{ color: 'var(--text-tertiary)' }}>Cargando pacientes...</p>
            ) : (
                <Card className="border-0">
                    <Card.Body className="p-0">
                        {citas.length === 0 ? (
                            <Alert variant="info">No hay citas programadas para hoy.</Alert>
                        ) : (
                            <div className="table-scroll">
                                <Table hover responsive className="align-middle mb-0">
                                    <thead>
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
                                                <td style={{ fontVariantNumeric: 'tabular-nums' }}>{cita.horaCita}</td>
                                                <td style={{ fontWeight: 500 }}>{cita.nombrePaciente}</td>
                                                <td>
                                                    {cita.estado === 'PAGADA' ? (
                                                        <Badge bg="success" className="p-2">PAGADA</Badge>
                                                    ) : (
                                                        <Badge bg="danger" className="p-2">PENDIENTE</Badge>
                                                    )}
                                                </td>
                                                <td>
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
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default AgendaDoctor;