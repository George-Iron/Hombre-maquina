import { useState, useEffect, useContext } from 'react';
import api from '../../config/axios';
import { AuthContext } from '../../context/AuthProvider';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Modal, Tabs, Tab, Badge, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ExpedienteModal from '../../components/ExpedienteModal';
import CalendarioCitas from '../../components/CalendarioCitas';

const AgendarCitaPage = () => {
    const { user } = useContext(AuthContext);

    // --- ESTADOS NAVEGACIÓN TAB ---
    const [activeTab, setActiveTab] = useState('agendar');

    // --- ESTADOS PACIENTE ---
    const [dniBusqueda, setDniBusqueda] = useState('');
    const [pacienteEncontrado, setPacienteEncontrado] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    // Formulario Nuevo Paciente
    const [formPaciente, setFormPaciente] = useState({
        documento: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '', fechaNac: '', telefono: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // --- ESTADOS PROGRAMACIÓN ---
    const [especialidad, setEspecialidad] = useState('');
    const [horarios, setHorarios] = useState([]);

    // --- ESTADOS CONTROL DE CITAS (FASE 3) ---
    const [citasList, setCitasList] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState('TODAS');
    const [busquedaCita, setBusquedaCita] = useState('');
    
    // Modal Cancelar
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [citaACancelar, setCitaACancelar] = useState(null);
    const [motivoCancelacion, setMotivoCancelacion] = useState('');

    // Modal Reprogramar
    const [showReprogramModal, setShowReprogramModal] = useState(false);
    const [citaAReprogramar, setCitaAReprogramar] = useState(null);
    const [especialidadReprogramar, setEspecialidadReprogramar] = useState('');
    const [horariosDisponiblesReprogramar, setHorariosDisponiblesReprogramar] = useState([]);
    const [nuevoHorarioSeleccionado, setNuevoHorarioSeleccionado] = useState('');

    // Modal Expediente 360
    const [showExpedienteModal, setShowExpedienteModal] = useState(false);
    const [dniExpediente, setDniExpediente] = useState('');

    const todayStr = new Date().toISOString().split('T')[0];
    const isDniSearchValid = /^\d{8}$/.test(dniBusqueda);

    useEffect(() => {
        if (activeTab === 'gestion') {
            cargarCitas();
        }
    }, [activeTab]);

    const cargarCitas = async () => {
        try {
            const res = await api.get('/cita/listar');
            setCitasList(res.data);
        } catch (error) {
            console.error("Error al cargar lista de citas:", error);
            toast.error("Error al cargar listado de citas.");
            setCitasList([]);
        }
    };

    const isFormPacienteValid = () => {
        const isDoc = /^\d{8}$/.test(formPaciente.documento);
        const isNom = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(formPaciente.nombre.trim());
        const isPat = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(formPaciente.apellidoPaterno.trim());
        const isMat = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(formPaciente.apellidoMaterno.trim());
        const isTel = /^9\d{8}$/.test(formPaciente.telefono);
        const isFecha = formPaciente.fechaNac && formPaciente.fechaNac <= todayStr && formPaciente.fechaNac >= '1900-01-01';
        return isDoc && isNom && isPat && isMat && isTel && isFecha;
    };

    // 1. BUSCAR PACIENTE
    const buscarPaciente = async () => {
        if (!isDniSearchValid) return toast.warning("Ingrese un DNI válido de 8 dígitos.");
        try {
            const res = await api.get(`/paciente/buscar/${dniBusqueda}`);
            setPacienteEncontrado(res.data);
            toast.success("Paciente encontrado.");
        } catch (error) {
            setPacienteEncontrado(null);
            toast.info("Paciente no encontrado. Puede registrarlo ahora.");
            setFormPaciente({ ...formPaciente, documento: dniBusqueda });
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormPaciente({
            documento: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '', fechaNac: '', telefono: ''
        });
        setErrors({});
        setTouched({});
    };

    // 2. REGISTRAR PACIENTE NUEVO
    const handleRegistrarPaciente = async (e) => {
        e.preventDefault();
        if (!isFormPacienteValid()) {
            toast.error("Por favor, corrija los campos marcados antes de registrar.");
            return;
        }
        const payload = {
            documento: formPaciente.documento,
            nombre: formPaciente.nombre.trim(),
            apellido: `${formPaciente.apellidoPaterno.trim()} ${formPaciente.apellidoMaterno.trim()}`,
            fechaNac: formPaciente.fechaNac,
            telefono: formPaciente.telefono
        };
        try {
            const res = await api.post('/paciente/registrar', payload);
            setPacienteEncontrado(res.data);
            handleCloseModal();
            toast.success("Paciente registrado y seleccionado con éxito.");
        } catch (error) {
            toast.error("Error al registrar paciente.");
            console.error(error);
        }
    };
    
    // 3. BUSCAR HORARIOS DISPONIBLES
    const buscarHorarios = async () => {
        if(!especialidad) return toast.warning("Seleccione una especialidad primero.");
        try {
            const res = await api.get(`/programacion/horario/disponibles?especialidad=${especialidad}`);
            setHorarios(res.data);
        } catch (error) { console.error(error); }
    };

    // 4. AGENDAR CITA FINAL
    const handleAgendar = async (idHorario) => {
        if (!pacienteEncontrado) return toast.error("Falta identificar al paciente");

        const payload = {
            dniPaciente: pacienteEncontrado.documento,
            idHorario: idHorario,
            idEncargado: user.id
        };

        try {
            await api.post('/cita/registrar', payload);
            toast.success("Cita agendada exitosamente.");
            buscarHorarios();
        } catch (error) {
            toast.error("Error al agendar la cita.");
            console.error(error);
        }
    };

    // 5. CANCELAR CITA
    const handleOpenCancelModal = (cita) => {
        setCitaACancelar(cita);
        setMotivoCancelacion('');
        setShowCancelModal(true);
    };

    const ejecutarCancelacion = async () => {
        if (!citaACancelar) return;
        setShowCancelModal(false);
        try {
            await api.put(`/cita/actualizar-estado/${citaACancelar.idCita}?estado=CANCELADA`);
            toast.success(`Cita #${citaACancelar.idCita} cancelada correctamente.`);
            cargarCitas();
        } catch (error) {
            toast.error("Error al cancelar la cita.");
            console.error(error);
        }
    };

    // 6. REPROGRAMAR CITA
    const handleOpenReprogramModal = (cita) => {
        setCitaAReprogramar(cita);
        setEspecialidadReprogramar(cita.especialidadMedico || '');
        setNuevoHorarioSeleccionado('');
        setHorariosDisponiblesReprogramar([]);
        setShowReprogramModal(true);
        if (cita.especialidadMedico) {
            cargarHorariosReprogramar(cita.especialidadMedico);
        }
    };

    const cargarHorariosReprogramar = async (esp) => {
        try {
            const res = await api.get(`/programacion/horario/disponibles?especialidad=${esp}`);
            setHorariosDisponiblesReprogramar(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const ejecutarReprogramacion = async () => {
        if (!citaAReprogramar || !nuevoHorarioSeleccionado) {
            toast.warning("Seleccione un nuevo horario disponible.");
            return;
        }
        setShowReprogramModal(false);
        try {
            // Cancelar la cita anterior y agendar la nueva
            await api.put(`/cita/actualizar-estado/${citaAReprogramar.idCita}?estado=CANCELADA`);
            await api.post('/cita/registrar', {
                dniPaciente: citaAReprogramar.dniPaciente,
                idHorario: nuevoHorarioSeleccionado,
                idEncargado: user.id
            });
            toast.success(`Cita reprogramada con éxito.`);
            cargarCitas();
        } catch (error) {
            toast.error("Error al reprogramar la cita.");
            console.error(error);
        }
    };

    // Filtros de tabla de gestión de citas
    const citasFiltradas = citasList.filter(c => {
        const termino = busquedaCita.toLowerCase().trim();
        const pacienteMatch = (c.nombrePaciente || '').toLowerCase().includes(termino) || (c.dniPaciente || '').toLowerCase().includes(termino);
        const estadoMatch = filtroEstado === 'TODAS' || c.estado === filtroEstado;
        return pacienteMatch && estadoMatch;
    });

    const renderEstadoBadge = (estado) => {
        if (estado === 'PAGADA') return <Badge bg="success">PAGADA</Badge>;
        if (estado === 'PENDIENTE_PAGO') return <Badge bg="warning" text="dark">PENDIENTE PAGO</Badge>;
        if (estado === 'ATENDIDA') return <Badge bg="info">ATENDIDA</Badge>;
        if (estado === 'CANCELADA') return <Badge bg="danger">CANCELADA</Badge>;
        return <Badge bg="secondary">{estado}</Badge>;
    };

    return (
        <Container className="p-0" fluid>
            <div className="page-header">
                <h2>Gestión de Citas y Reserva</h2>
                <p>Búsqueda de paciente, agendamiento, reprogramación y cancelación de citas médicas.</p>
            </div>

            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', padding: 'var(--space-lg)' }}>
                <Tabs activeKey={activeTab} onSelect={k => setActiveTab(k)} className="mb-4">
                    
                    {/* TAB 1: AGENDAR NUEVA CITA */}
                    <Tab eventKey="agendar" title="➕ Agendar Nueva Cita">
                        <Row className="g-3 mt-1">
                            {/* --- COLUMNA IZQUIERDA: PACIENTE --- */}
                            <Col md={4}>
                                <Card className="border-0 mb-4 shadow-sm">
                                    <Card.Header className="bg-light">
                                        <h5 className="mb-0 text-secondary">1. Identificar Paciente</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="input-group mb-3">
                                            <Form.Control 
                                                placeholder="Ingrese DNI (8 dígitos)" 
                                                value={dniBusqueda} 
                                                maxLength={8}
                                                inputMode="numeric"
                                                onChange={e => setDniBusqueda(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                                onKeyPress={e => e.key === 'Enter' && buscarPaciente()}
                                                isInvalid={dniBusqueda.length > 0 && !isDniSearchValid}
                                                aria-label="Ingresar DNI del Paciente para buscar"
                                            />
                                            <Button variant="outline-primary" disabled={!isDniSearchValid} onClick={buscarPaciente} aria-label="Buscar paciente por DNI">
                                                Buscar
                                            </Button>
                                        </div>
                                        {dniBusqueda.length > 0 && !isDniSearchValid && (
                                            <small style={{ color: 'var(--semantic-danger)', marginTop: '-8px', marginBottom: '12px', display: 'block' }}>
                                                El DNI debe tener 8 dígitos numéricos.
                                            </small>
                                        )}

                                        {pacienteEncontrado ? (
                                            <Alert variant="success" className="text-center">
                                                <h5 style={{ fontFamily: 'var(--font-serif)' }}>{pacienteEncontrado.nombre} {pacienteEncontrado.apellido}</h5>
                                                <small>DNI: {pacienteEncontrado.documento}</small><br/>
                                                <small>Tel: {pacienteEncontrado.telefono}</small>
                                                <div className="mt-3 d-flex gap-1 justify-content-center">
                                                    <Button variant="outline-info" size="sm" onClick={() => { setDniExpediente(pacienteEncontrado.documento); setShowExpedienteModal(true); }}>
                                                        📋 Expediente
                                                    </Button>
                                                    <Button variant="outline-danger" size="sm" onClick={() => setPacienteEncontrado(null)}>
                                                        Cambiar Paciente
                                                    </Button>
                                                </div>
                                            </Alert>
                                        ) : (
                                            <div className="text-center">
                                                <p className="text-muted small">Si el paciente no existe, regístrelo aquí:</p>
                                                <Button variant="primary" className="w-100" onClick={() => setShowModal(true)}>
                                                    Registrar Nuevo Paciente
                                                </Button>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>

                            {/* --- COLUMNA DERECHA: HORARIOS --- */}
                            <Col md={8}>
                                <Card className="border-0 shadow-sm">
                                    <Card.Header className="bg-light">
                                        <h5 className="mb-0 text-secondary">2. Seleccionar Horario</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="d-flex gap-3 align-items-center mb-4 p-3 rounded" style={{ background: 'var(--surface-inset)' }}>
                                            <Form.Select value={especialidad} onChange={e => setEspecialidad(e.target.value)} aria-label="Filtrar por especialidad médica">
                                                <option value="">Filtrar por Especialidad...</option>
                                                <option value="Cardiologia">Cardiología</option>
                                                <option value="Pediatria">Pediatría</option>
                                                <option value="General">Medicina General</option>
                                                <option value="Dermatologia">Dermatología</option>
                                            </Form.Select>
                                            <Button onClick={buscarHorarios} variant="primary" size="sm" disabled={!especialidad} style={{ whiteSpace: 'nowrap' }} aria-label="Buscar horarios de turnos disponibles">Buscar Disponibles</Button>
                                        </div>

                                        <div className="table-scroll">
                                            <Table hover responsive className="align-middle mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Fecha</th>
                                                        <th>Hora</th>
                                                        <th>Médico</th>
                                                        <th>Consultorio</th>
                                                        <th>Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {horarios.map(h => (
                                                        <tr key={h.idProgramacion}>
                                                            <td style={{ fontVariantNumeric: 'tabular-nums' }}>{h.fecha}</td>
                                                            <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{h.horaInicio}</td>
                                                            <td>{h.nombreMedico}</td>
                                                            <td><span className="badge bg-info">{h.consultorio?.nombre}</span></td>
                                                            <td>
                                                                <Button size="sm" variant="primary" 
                                                                    disabled={!pacienteEncontrado}
                                                                    onClick={() => handleAgendar(h.idProgramacion)}
                                                                    aria-label={`Reservar Cita con Dr. ${h.nombreMedico}`}>
                                                                    Reservar Cita
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {horarios.length === 0 && (
                                                        <tr>
                                                            <td colSpan="5" className="text-center p-4 text-muted">
                                                                {especialidad ? "No hay horarios disponibles para esta especialidad." : "Seleccione una especialidad y haga clic en Buscar Disponibles."}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab>

                    {/* TAB 2: CONTROL Y GESTIÓN DE CITAS PROGRAMADAS (FASE 3) */}
                    <Tab eventKey="gestion" title={`📋 Citas Programadas (${citasList.length})`}>
                        <div className="mt-2">
                            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                                <div className="d-flex gap-2 align-items-center">
                                    <Form.Select 
                                        size="sm" 
                                        value={filtroEstado} 
                                        onChange={e => setFiltroEstado(e.target.value)}
                                        style={{ width: '180px' }}
                                    >
                                        <option value="TODAS">Todos los Estados</option>
                                        <option value="PENDIENTE_PAGO">Pendiente de Pago</option>
                                        <option value="PAGADA">Pagada</option>
                                        <option value="ATENDIDA">Atendida</option>
                                        <option value="CANCELADA">Cancelada</option>
                                    </Form.Select>
                                    
                                    <Button variant="outline-secondary" size="sm" onClick={cargarCitas}>
                                        🔄 Actualizar
                                    </Button>
                                </div>

                                <InputGroup size="sm" style={{ maxWidth: '300px' }}>
                                    <Form.Control 
                                        placeholder="Buscar por Paciente o DNI..."
                                        value={busquedaCita}
                                        onChange={e => setBusquedaCita(e.target.value)}
                                    />
                                    {busquedaCita && (
                                        <Button variant="outline-secondary" onClick={() => setBusquedaCita('')}>✕</Button>
                                    )}
                                </InputGroup>
                            </div>

                            <div className="table-scroll border rounded overflow-hidden">
                                <Table hover responsive className="align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>ID Cita</th>
                                            <th>Paciente</th>
                                            <th>Fecha y Hora</th>
                                            <th>Médico / Especialidad</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {citasFiltradas.map(c => (
                                            <tr key={c.idCita}>
                                                <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>#{c.idCita}</td>
                                                <td>
                                                    <div className="fw-semibold">{c.nombrePaciente}</div>
                                                    <small className="text-muted">DNI: {c.dniPaciente || 'N/A'}</small>
                                                </td>
                                                <td style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                    {c.fechaCita} <br />
                                                    <small className="text-muted">{c.horaCita}</small>
                                                </td>
                                                <td>{c.infoMedico}</td>
                                                <td>{renderEstadoBadge(c.estado)}</td>
                                                <td>
                                                    <div className="d-flex gap-1 flex-wrap">
                                                        {c.dniPaciente && (
                                                            <Button variant="outline-info" size="sm" onClick={() => { setDniExpediente(c.dniPaciente); setShowExpedienteModal(true); }}>
                                                                📋 Expediente
                                                            </Button>
                                                        )}
                                                        {c.estado !== 'CANCELADA' && c.estado !== 'ATENDIDA' && (
                                                            <>
                                                                <Button variant="outline-warning" size="sm" onClick={() => handleOpenReprogramModal(c)}>
                                                                    📅 Reprogramar
                                                                </Button>
                                                                <Button variant="outline-danger" size="sm" onClick={() => handleOpenCancelModal(c)}>
                                                                    🚫 Cancelar
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {citasFiltradas.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center p-4 text-muted">
                                                    No se encontraron citas programadas registradas.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </Tab>

                    {/* TAB 3: CALENDARIO INTERACTIVO DE CITAS */}
                    <Tab eventKey="calendario" title="📅 Calendario Visual">
                        <div className="pt-3">
                            <CalendarioCitas 
                                citas={citasList} 
                                onVerExpediente={(dni) => {
                                    setDniExpediente(dni);
                                    setShowExpedienteModal(true);
                                }}
                            />
                        </div>
                    </Tab>
                </Tabs>
            </div>

            {/* MODAL REGISTRAR PACIENTE */}
            <Modal show={showModal} onHide={handleCloseModal} centered aria-labelledby="modal-paciente-title">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-paciente-title">Registrar Nuevo Paciente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleRegistrarPaciente} noValidate>
                        <Form.Group className="mb-3">
                            <Form.Label>DNI (8 dígitos)</Form.Label>
                            <Form.Control 
                                name="documento" required maxLength="8" inputMode="numeric"
                                onChange={e => setFormPaciente({...formPaciente, documento: e.target.value.replace(/\D/g, '').slice(0, 8)})} 
                                value={formPaciente.documento} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombres</Form.Label>
                            <Form.Control 
                                name="nombre" required 
                                onChange={e => setFormPaciente({...formPaciente, nombre: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')})} 
                                value={formPaciente.nombre} 
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido Paterno</Form.Label>
                                    <Form.Control 
                                        name="apellidoPaterno" required maxLength="50"
                                        onChange={e => setFormPaciente({...formPaciente, apellidoPaterno: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')})} 
                                        value={formPaciente.apellidoPaterno} 
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido Materno</Form.Label>
                                    <Form.Control 
                                        name="apellidoMaterno" required maxLength="50"
                                        onChange={e => setFormPaciente({...formPaciente, apellidoMaterno: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')})} 
                                        value={formPaciente.apellidoMaterno} 
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha de Nacimiento</Form.Label>
                                    <Form.Control 
                                        name="fechaNac" type="date" max={todayStr} required 
                                        onChange={e => setFormPaciente({...formPaciente, fechaNac: e.target.value})} 
                                        value={formPaciente.fechaNac} 
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Teléfono (9 dígitos)</Form.Label>
                                    <Form.Control 
                                        name="telefono" required maxLength="9" inputMode="numeric"
                                        onChange={e => {
                                            let digits = e.target.value.replace(/\D/g, '');
                                            if (digits.length > 0 && digits[0] !== '9') digits = '';
                                            setFormPaciente({...formPaciente, telefono: digits.slice(0, 9)});
                                        }} 
                                        value={formPaciente.telefono} 
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                            <Button type="submit" variant="primary" disabled={!isFormPacienteValid()}>Guardar y Seleccionar</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* MODAL CANCELAR CITA */}
            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cancelar Cita Médica #{citaACancelar?.idCita}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro de que desea cancelar la cita de <strong>{citaACancelar?.nombrePaciente}</strong>?
                    <Form.Group className="mt-3">
                        <Form.Label>Motivo de la Cancelación (opcional):</Form.Label>
                        <Form.Select value={motivoCancelacion} onChange={e => setMotivoCancelacion(e.target.value)}>
                            <option value="">Seleccione motivo...</option>
                            <option value="Solicitud del Paciente">Solicitud del Paciente</option>
                            <option value="Inasistencia del Doctor">Inasistencia / Ausencia del Doctor</option>
                            <option value="Error de Agendamiento">Error de Agendamiento</option>
                            <option value="Otro">Otro Motivo</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>Volver</Button>
                    <Button variant="danger" onClick={ejecutarCancelacion}>Confirmar Cancelación</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL REPROGRAMAR CITA */}
            <Modal show={showReprogramModal} onHide={() => setShowReprogramModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Reprogramar Cita #{citaAReprogramar?.idCita}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-2"><strong>Paciente:</strong> {citaAReprogramar?.nombrePaciente}</p>
                    <p className="mb-3"><strong>Cita Original:</strong> {citaAReprogramar?.fechaCita} - {citaAReprogramar?.horaCita} ({citaAReprogramar?.infoMedico})</p>
                    
                    <hr />
                    
                    <h6>Seleccionar Nuevo Turno Disponible:</h6>
                    <div className="d-flex gap-2 mb-3">
                        <Form.Select 
                            value={especialidadReprogramar} 
                            onChange={e => {
                                setEspecialidadReprogramar(e.target.value);
                                cargarHorariosReprogramar(e.target.value);
                            }}
                        >
                            <option value="">Especialidad...</option>
                            <option value="Cardiologia">Cardiología</option>
                            <option value="Pediatria">Pediatría</option>
                            <option value="General">Medicina General</option>
                            <option value="Dermatologia">Dermatología</option>
                        </Form.Select>
                    </div>

                    <Table hover responsive size="sm" className="align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Médico</th>
                                <th>Consultorio</th>
                                <th>Seleccionar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {horariosDisponiblesReprogramar.map(h => (
                                <tr key={h.idProgramacion}>
                                    <td>{h.fecha}</td>
                                    <td className="fw-bold">{h.horaInicio}</td>
                                    <td>{h.nombreMedico}</td>
                                    <td>{h.consultorio?.nombre}</td>
                                    <td>
                                        <Form.Check 
                                            type="radio" 
                                            name="horarioReprogramar" 
                                            value={h.idProgramacion}
                                            checked={nuevoHorarioSeleccionado == h.idProgramacion}
                                            onChange={e => setNuevoHorarioSeleccionado(e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {horariosDisponiblesReprogramar.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center p-3 text-muted">No hay otros horarios disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReprogramModal(false)}>Cancelar</Button>
                    <Button variant="primary" disabled={!nuevoHorarioSeleccionado} onClick={ejecutarReprogramacion}>Confirmar Reprogramación</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL EXPEDIENTE 360 */}
            <ExpedienteModal 
                show={showExpedienteModal} 
                onHide={() => { setShowExpedienteModal(false); setDniExpediente(''); }} 
                dniPaciente={dniExpediente} 
            />
        </Container>
    );
};

export default AgendarCitaPage;