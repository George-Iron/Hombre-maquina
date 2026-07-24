import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { Container, Table, Badge, Button, Card, Alert, Tabs, Tab } from 'react-bootstrap';
import ExpedienteModal from '../../components/ExpedienteModal';
import CalendarioCitas from '../../components/CalendarioCitas';

const AgendaDoctor = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('agenda_dia');

    const [citasHoy, setCitasHoy] = useState([]);
    const [citasTodas, setCitasTodas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [showExpedienteModal, setShowExpedienteModal] = useState(false);
    const [dniExpediente, setDniExpediente] = useState('');

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    useEffect(() => {
        cargarAgenda();
    }, []);

    const cargarAgenda = async () => {
        setLoading(true);
        try {
            const hoy = getTodayDate();
            const [resHoy, resTodas] = await Promise.all([
                api.get(`/cita/agenda?fecha=${hoy}`).catch(() => ({ data: [] })),
                api.get('/cita/listar').catch(() => ({ data: [] }))
            ]);
            setCitasHoy(resHoy.data || []);
            setCitasTodas(resTodas.data || []);
        } catch (err) {
            console.error(err);
            setError('No se pudo cargar la agenda médica.');
        } finally {
            setLoading(false);
        }
    };

    const handleAtender = (idCita) => {
        navigate(`/medico/atencion/${idCita}`);
    };

    return (
        <Container fluid className="p-0">
            <div className="page-header">
                <h2>Agenda y Programación Médica</h2>
                <p>Fecha actual: {getTodayDate()}</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', padding: 'var(--space-lg)' }}>
                <Tabs activeKey={activeTab} onSelect={k => setActiveTab(k)} className="mb-4">
                    
                    {/* TAB 1: AGENDA DEL DÍA */}
                    <Tab eventKey="agenda_dia" title="📋 Citas del Día">
                        {loading ? (
                            <p style={{ color: 'var(--text-tertiary)' }} className="p-3">Cargando agenda de hoy...</p>
                        ) : (
                            <Card className="border-0 shadow-sm mt-2">
                                <Card.Body className="p-0">
                                    {citasHoy.length === 0 ? (
                                        <Alert variant="info" className="m-3">No hay citas programadas para el día de hoy.</Alert>
                                    ) : (
                                        <div className="table-scroll">
                                            <Table hover responsive className="align-middle mb-0">
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th>Hora</th>
                                                        <th>Paciente</th>
                                                        <th>Estado de Pago</th>
                                                        <th>Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {citasHoy.map((cita) => (
                                                        <tr key={cita.idCita}>
                                                            <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }} className="text-primary">{cita.horaCita}</td>
                                                            <td style={{ fontWeight: 500 }}>{cita.nombrePaciente}</td>
                                                            <td>
                                                                {cita.estado === 'PAGADA' ? (
                                                                    <Badge bg="success" className="p-2">PAGADA</Badge>
                                                                ) : cita.estado === 'ATENDIDA' ? (
                                                                    <Badge bg="info" className="p-2">ATENDIDA</Badge>
                                                                ) : (
                                                                    <Badge bg="warning" text="dark" className="p-2">PENDIENTE</Badge>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <Button 
                                                                        variant={cita.estado === 'PAGADA' ? "primary" : cita.estado === 'ATENDIDA' ? "outline-primary" : "secondary"}
                                                                        size="sm"
                                                                        disabled={cita.estado !== 'PAGADA' && cita.estado !== 'ATENDIDA'}
                                                                        onClick={() => handleAtender(cita.idCita)}
                                                                    >
                                                                        {cita.estado === 'ATENDIDA' ? 'Ver Atención' : cita.estado === 'PAGADA' ? 'Atender Paciente' : 'Debe Pagar'}
                                                                    </Button>
                                                                    {cita.dniPaciente && (
                                                                        <Button 
                                                                            variant="outline-info" 
                                                                            size="sm"
                                                                            onClick={() => { setDniExpediente(cita.dniPaciente); setShowExpedienteModal(true); }}
                                                                        >
                                                                            📋 Expediente
                                                                        </Button>
                                                                    )}
                                                                </div>
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
                    </Tab>

                    {/* TAB 2: CALENDARIO VISUAL DE CITAS */}
                    <Tab eventKey="calendario" title="📅 Calendario Visual Médicos">
                        <div className="pt-3">
                            <CalendarioCitas 
                                citas={citasTodas.length > 0 ? citasTodas : citasHoy}
                                onVerExpediente={(dni) => {
                                    setDniExpediente(dni);
                                    setShowExpedienteModal(true);
                                }}
                            />
                        </div>
                    </Tab>
                </Tabs>
            </div>

            {/* Modal de Expediente 360° */}
            <ExpedienteModal 
                show={showExpedienteModal} 
                onHide={() => { setShowExpedienteModal(false); setDniExpediente(''); }} 
                dniPaciente={dniExpediente} 
            />
        </Container>
    );
};

export default AgendaDoctor;