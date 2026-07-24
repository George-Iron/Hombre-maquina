import { useState, useEffect } from 'react';
import { Modal, Form, ListGroup, Badge, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
import ExpedienteModal from './ExpedienteModal';

const GlobalSearchModal = ({ show, onHide }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const [pacientes, setPacientes] = useState([]);
    const [citas, setCitas] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [medicamentos, setMedicamentos] = useState([]);

    // Expediente modal interno
    const [showExpedienteModal, setShowExpedienteModal] = useState(false);
    const [dniExpediente, setDniExpediente] = useState('');

    useEffect(() => {
        if (show) {
            cargarDatosGlobales();
        } else {
            setQuery('');
        }
    }, [show]);

    const cargarDatosGlobales = async () => {
        setLoading(true);
        try {
            const [resPac, resCitas, resMeds, resDocs] = await Promise.all([
                api.get('/paciente/listar').catch(() => ({ data: [] })),
                api.get('/cita/listar').catch(() => ({ data: [] })),
                api.get('/farmacia/listar').catch(() => ({ data: [] })),
                api.get('/personal/listar/DOCTOR').catch(() => ({ data: [] }))
            ]);
            setPacientes(resPac.data || []);
            setCitas(resCitas.data || []);
            setMedicamentos(resMeds.data || []);
            setMedicos(resDocs.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const termino = query.toLowerCase().trim();

    const pacientesCoincidentes = !termino ? [] : pacientes.filter(p => 
        (p.nombre || '').toLowerCase().includes(termino) || 
        (p.apellido || '').toLowerCase().includes(termino) || 
        (p.documento || '').toLowerCase().includes(termino)
    ).slice(0, 5);

    const citasCoincidentes = !termino ? [] : citas.filter(c => 
        (c.nombrePaciente || '').toLowerCase().includes(termino) || 
        (c.dniPaciente || '').toLowerCase().includes(termino) ||
        String(c.idCita).includes(termino)
    ).slice(0, 5);

    const medicosCoincidentes = !termino ? [] : medicos.filter(m => 
        (m.nombre || '').toLowerCase().includes(termino) || 
        (m.apellido || '').toLowerCase().includes(termino) ||
        (m.especialidad || '').toLowerCase().includes(termino)
    ).slice(0, 5);

    const medicamentosCoincidentes = !termino ? [] : medicamentos.filter(m => 
        (m.nombre || '').toLowerCase().includes(termino) || 
        (m.laboratorio || '').toLowerCase().includes(termino)
    ).slice(0, 5);

    const hayResultados = pacientesCoincidentes.length > 0 || citasCoincidentes.length > 0 || medicosCoincidentes.length > 0 || medicamentosCoincidentes.length > 0;

    return (
        <>
            <Modal show={show} onHide={onHide} size="lg" centered className="no-print">
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title className="fs-5 text-primary">🔍 Buscador Global Inteligente</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form.Control
                        size="lg"
                        autoFocus
                        placeholder="Buscar Paciente (DNI/Nombre), Cita (#), Doctor o Medicamento..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="mb-4 shadow-sm border-primary"
                    />

                    {loading ? (
                        <div className="text-center p-4">
                            <Spinner animation="border" variant="primary" />
                            <small className="d-block text-muted mt-2">Indexando datos del sistema...</small>
                        </div>
                    ) : !termino ? (
                        <div className="text-center p-4 text-muted">
                            <div className="fs-2 mb-2">💡</div>
                            <p className="mb-0">Escriba un DNI, nombre de paciente, especialidad o medicamento para ver resultados instantáneos.</p>
                        </div>
                    ) : !hayResultados ? (
                        <div className="text-center p-4 text-muted">
                            No se encontraron coincidencia para "<strong>{query}</strong>".
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                            
                            {/* PACIENTES */}
                            {pacientesCoincidentes.length > 0 && (
                                <div>
                                    <h6 className="text-uppercase text-secondary small fw-bold mb-2">👤 Pacientes ({pacientesCoincidentes.length})</h6>
                                    <ListGroup hover>
                                        {pacientesCoincidentes.map(p => (
                                            <ListGroup.Item key={p.idPaciente} className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong className="text-dark">{p.nombre} {p.apellido}</strong>
                                                    <small className="text-muted d-block">DNI: {p.documento} &middot; Tel: {p.telefono || 'N/A'}</small>
                                                </div>
                                                <Button 
                                                    variant="outline-info" 
                                                    size="sm" 
                                                    onClick={() => {
                                                        onHide();
                                                        setDniExpediente(p.documento);
                                                        setShowExpedienteModal(true);
                                                    }}
                                                >
                                                    📋 Expediente 360°
                                                </Button>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </div>
                            )}

                            {/* CITAS */}
                            {citasCoincidentes.length > 0 && (
                                <div>
                                    <h6 className="text-uppercase text-secondary small fw-bold mb-2">📅 Citas Médicas ({citasCoincidentes.length})</h6>
                                    <ListGroup hover>
                                        {citasCoincidentes.map(c => (
                                            <ListGroup.Item key={c.idCita} className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>Cita #{c.idCita}</strong> - {c.nombrePaciente} (DNI {c.dniPaciente})
                                                    <small className="text-muted d-block">{c.fechaCita} - {c.horaCita} ({c.infoMedico})</small>
                                                </div>
                                                <Badge bg={c.estado === 'PAGADA' ? 'success' : c.estado === 'ATENDIDA' ? 'info' : 'warning'}>
                                                    {c.estado}
                                                </Badge>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </div>
                            )}

                            {/* DOCTORES */}
                            {medicosCoincidentes.length > 0 && (
                                <div>
                                    <h6 className="text-uppercase text-secondary small fw-bold mb-2">👨‍⚕️ Personal Médico ({medicosCoincidentes.length})</h6>
                                    <ListGroup hover>
                                        {medicosCoincidentes.map(m => (
                                            <ListGroup.Item key={m.idEmpleado} className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong className="text-dark">Dr(a). {m.nombre} {m.apellido}</strong>
                                                    <small className="text-muted d-block">Especialidad: {m.especialidad} &middot; DNI: {m.dni}</small>
                                                </div>
                                                <Badge bg="primary">{m.especialidad}</Badge>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </div>
                            )}

                            {/* MEDICAMENTOS */}
                            {medicamentosCoincidentes.length > 0 && (
                                <div>
                                    <h6 className="text-uppercase text-secondary small fw-bold mb-2">💊 Farmacia ({medicamentosCoincidentes.length})</h6>
                                    <ListGroup hover>
                                        {medicamentosCoincidentes.map(m => (
                                            <ListGroup.Item key={m.idMedicamento} className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong className="text-dark">{m.nombre}</strong>
                                                    <small className="text-muted d-block">Laboratorio: {m.laboratorio} &middot; Precio: S/ {m.precio}</small>
                                                </div>
                                                <Badge bg={(m.stock || 45) <= 10 ? 'warning' : 'success'}>
                                                    Stock: {m.stock !== undefined ? m.stock : 45} u
                                                </Badge>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </div>
                            )}

                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* Expediente Modal */}
            <ExpedienteModal 
                show={showExpedienteModal} 
                onHide={() => { setShowExpedienteModal(false); setDniExpediente(''); }} 
                dniPaciente={dniExpediente} 
            />
        </>
    );
};

export default GlobalSearchModal;
