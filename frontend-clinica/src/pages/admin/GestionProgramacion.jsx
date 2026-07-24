import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Container, Row, Col, Form, Button, Table, Tabs, Tab, Modal, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

const GestionProgramacion = () => {
    const [consultorios, setConsultorios] = useState([]);
    const [doctores, setDoctores] = useState([]);
    const [turnos, setTurnos] = useState([]);
    
    // Formulario Consultorio
    const [numCons, setNumCons] = useState('');

    // Formulario Horario
    const [formHorario, setFormHorario] = useState({ idMedico: '', idConsultorio: '', fecha: '', horaInicio: '' });
    const [horarioTouched, setHorarioTouched] = useState({});

    // Estado para edición de turnos
    const [modoEditar, setModoEditar] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    // Estado para eliminación de turnos
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idEliminar, setIdEliminar] = useState(null);

    const todayStr = new Date().toISOString().split('T')[0];

    const getNowTimeStr = () => {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        return `${hrs}:${mins}`;
    };
    const nowTimeStr = getNowTimeStr();

    const handleNumConsChange = (e) => {
        // Permitir estrictamente solo dígitos (0-9)
        const soloNumeros = e.target.value.replace(/\D/g, '');
        setNumCons(soloNumeros);
    };

    // Validaciones lógicas
    const isFechaValida = formHorario.fecha && formHorario.fecha >= todayStr;
    const isHoraValida = Boolean(
        formHorario.horaInicio && (
            formHorario.fecha > todayStr || 
            (formHorario.fecha === todayStr && formHorario.horaInicio > nowTimeStr)
        )
    );
    const isHorarioFormValid = Boolean(
        formHorario.idMedico && 
        formHorario.idConsultorio && 
        isFechaValida && 
        isHoraValida
    );
    
    const nombreCompletoCons = numCons ? `Consultorio ${numCons}` : '';
    const consultorioExiste = consultorios.some(c => 
        c.nombre && c.nombre.trim().toLowerCase() === nombreCompletoCons.trim().toLowerCase()
    );
    const isConsultorioValid = numCons.trim().length > 0 && !consultorioExiste;

    const handleGuardarConsultorio = async (e) => {
        e.preventDefault();
        if (!numCons.trim()) {
            toast.error("Por favor ingrese el número del consultorio.");
            return;
        }
        if (consultorioExiste) {
            toast.error(`El consultorio '${nombreCompletoCons}' ya se encuentra registrado.`);
            return;
        }
        try {
            await api.post('/programacion/consultorio/registrar', { nombre: nombreCompletoCons });
            toast.success(`Consultorio '${nombreCompletoCons}' registrado con éxito.`);
            setNumCons('');
            cargarConsultorios();
        } catch (error) { 
            toast.error("Error al crear consultorio."); 
            console.error(error);
        }
    };

    useEffect(() => {
        cargarConsultorios();
        cargarDoctores();
        cargarTurnos();
    }, []);

    const cargarTurnos = async () => {
        try {
            const res = await api.get('/programacion/horario/listar');
            setTurnos(res.data);
        } catch (error) {
            toast.error("Error al cargar los turnos.");
            console.error(error);
        }
    };

    const cargarConsultorios = async () => {
        try {
            const res = await api.get('/programacion/consultorio/listar');
            setConsultorios(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const cargarDoctores = async () => {
        try {
            const res = await api.get('/personal/listar/DOCTOR');
            setDoctores(res.data);
        } catch (error) {
            console.error(error);
        }
    };



    const handleEditarTurno = (t) => {
        // Buscar el doctor correspondiente por nombre
        const doctorEncontrado = doctores.find(d => 
            `${d.nombre} ${d.apellido}` === t.nombreMedico
        );
        setFormHorario({
            idMedico: doctorEncontrado ? doctorEncontrado.idEmpleado : (t.idMedico || ''),
            idConsultorio: t.consultorio ? t.consultorio.idConsultorio : '',
            fecha: t.fecha || '',
            horaInicio: t.horaInicio ? t.horaInicio.substring(0, 5) : ''
        });
        setModoEditar(true);
        setIdEditar(t.idProgramacion);
        setHorarioTouched({});
    };

    const handleConfirmarEliminarTurno = (id) => {
        setIdEliminar(id);
        setShowDeleteModal(true);
    };

    const ejecutarEliminacionTurno = async () => {
        if (!idEliminar) return;
        setShowDeleteModal(false);
        try {
            await api.delete(`/programacion/horario/eliminar/${idEliminar}`);
            toast.success("Turno eliminado con éxito.");
            setIdEliminar(null);
            cargarTurnos();
        } catch (error) {
            toast.error("Error al eliminar el turno.");
            console.error(error);
        }
    };

    const cancelarEdicion = () => {
        setModoEditar(false);
        setIdEditar(null);
        setFormHorario({ idMedico: '', idConsultorio: '', fecha: '', horaInicio: '' });
        setHorarioTouched({});
    };

    const handleGuardarHorario = async (e) => {
        e.preventDefault();
        if (formHorario.fecha === todayStr && formHorario.horaInicio <= getNowTimeStr()) {
            toast.error("Para el día de hoy, debe seleccionar una hora posterior a la actual.");
            return;
        }
        if (!isHorarioFormValid) {
            toast.error("Verifique que todos los campos del horario sean válidos.");
            return;
        }

        const payload = {
            idMedico: formHorario.idMedico,
            consultorio: { idConsultorio: formHorario.idConsultorio },
            fecha: formHorario.fecha,
            horaInicio: formHorario.horaInicio + ":00"
        };

        try {
            if (modoEditar) {
                await api.put(`/programacion/horario/actualizar/${idEditar}`, payload);
                toast.success("Horario actualizado con éxito.");
            } else {
                await api.post('/programacion/horario/registrar', payload);
                toast.success("Horario programado con éxito.");
            }
            setFormHorario({ idMedico: '', idConsultorio: '', fecha: '', horaInicio: '' });
            setHorarioTouched({});
            setModoEditar(false);
            setIdEditar(null);
            cargarTurnos();
        } catch (error) { 
            toast.error(modoEditar ? "Error al actualizar el horario." : "Error: Posible cruce de horarios o conflicto de asignación."); 
            console.error(error);
        }
    };

    const renderEstadoBadge = (estado) => {
        let bg = '#f3f4f6';
        let color = '#374151';
        let badgeClass = "badge rounded-pill px-3 py-2 fw-semibold";
        
        if (estado === 'LIBRE') {
            badgeClass += " badge-libre";
            bg = '#def7ec';
            color = '#03543f';
        } else if (estado === 'PENDIENTE') {
            badgeClass += " badge-pendiente";
            bg = '#fef3c7';
            color = '#92400e';
        } else if (estado === 'OCUPADO') {
            badgeClass += " badge-ocupado";
            bg = '#e1effe';
            color = '#1e429f';
        }
        
        return (
            <span className={badgeClass} style={{ backgroundColor: bg, color: color, fontSize: '0.85rem' }}>
                {estado}
            </span>
        );
    };

    return (
        <Container fluid className="p-0">
            <div className="page-header">
                <h2>Gestión de Infraestructura</h2>
            </div>

            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', padding: 'var(--space-lg)' }}>
                <Tabs defaultActiveKey="horarios" className="mb-4">
                    
                    {/* TAB 1: ASIGNAR HORARIOS */}
                    <Tab eventKey="horarios" title="Asignar Horarios">
                        <div className="p-2">
                            <h4 className="mb-4 text-secondary">{modoEditar ? 'Editar Turno Médico' : 'Programar Turno Médico'}</h4>
                            <Form onSubmit={handleGuardarHorario} noValidate>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Médico</Form.Label>
                                            <Form.Select 
                                                required 
                                                onChange={e => {
                                                    setFormHorario({...formHorario, idMedico: e.target.value});
                                                    setHorarioTouched({...horarioTouched, idMedico: true});
                                                }} 
                                                value={formHorario.idMedico} 
                                                isInvalid={horarioTouched.idMedico && !formHorario.idMedico}
                                                aria-label="Seleccionar médico para el turno"
                                            >
                                                <option value="">Seleccione Doctor...</option>
                                                {doctores.map(d => (
                                                    <option key={d.idEmpleado} value={d.idEmpleado}>{d.nombre} {d.apellido} ({d.especialidad})</option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Debe seleccionar un médico.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Consultorio</Form.Label>
                                            <Form.Select 
                                                required 
                                                onChange={e => {
                                                    setFormHorario({...formHorario, idConsultorio: e.target.value});
                                                    setHorarioTouched({...horarioTouched, idConsultorio: true});
                                                }} 
                                                value={formHorario.idConsultorio} 
                                                isInvalid={horarioTouched.idConsultorio && !formHorario.idConsultorio}
                                                aria-label="Seleccionar consultorio para el turno"
                                            >
                                                <option value="">Seleccione Consultorio...</option>
                                                {consultorios.map(c => (
                                                    <option key={c.idConsultorio} value={c.idConsultorio}>{c.nombre}</option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Debe seleccionar un consultorio.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Fecha del Turno</Form.Label>
                                            <Form.Control 
                                                type="date" 
                                                required 
                                                min={todayStr}
                                                onChange={e => {
                                                    setFormHorario({...formHorario, fecha: e.target.value});
                                                    setHorarioTouched({...horarioTouched, fecha: true});
                                                }} 
                                                value={formHorario.fecha} 
                                                isInvalid={horarioTouched.fecha && !isFechaValida}
                                                aria-label="Seleccionar fecha del turno" 
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                La fecha no puede ser anterior al día de hoy.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Hora Inicio</Form.Label>
                                            <Form.Control 
                                                type="time" 
                                                required 
                                                min={formHorario.fecha === todayStr ? nowTimeStr : undefined}
                                                onChange={e => {
                                                    setFormHorario({...formHorario, horaInicio: e.target.value});
                                                    setHorarioTouched({...horarioTouched, horaInicio: true});
                                                }} 
                                                value={formHorario.horaInicio} 
                                                isInvalid={horarioTouched.horaInicio && !isHoraValida}
                                                aria-label="Seleccionar hora de inicio del turno" 
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {!formHorario.horaInicio 
                                                    ? "Debe seleccionar la hora de inicio." 
                                                    : (formHorario.fecha === todayStr && formHorario.horaInicio <= nowTimeStr)
                                                        ? "Para hoy, la hora debe ser posterior a la hora actual."
                                                        : "Debe seleccionar una hora válida."}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-end gap-2 mt-3">
                                    {modoEditar && (
                                        <Button variant="secondary" className="px-4" onClick={cancelarEdicion} aria-label="Cancelar edición del turno">
                                            Cancelar Edición
                                        </Button>
                                    )}
                                    <Button type="submit" variant="primary" className="px-4" disabled={!isHorarioFormValid} aria-label={modoEditar ? "Actualizar programación del turno médico" : "Guardar programación del turno médico"}>
                                        {modoEditar ? 'Actualizar Programación' : 'Guardar Programación'}
                                    </Button>
                                </div>
                            </Form>

                            {/* TABLA DE TURNOS REGISTRADOS */}
                            <div className="mt-5 border-top pt-4">
                                <h5 className="mb-4 text-secondary">Turnos Programados Registrados</h5>
                                <div className="border rounded overflow-hidden shadow-sm">
                                    <Table hover responsive className="align-middle mb-0 bg-white">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="p-3 text-secondary border-0">Médico</th>
                                                <th className="p-3 text-secondary border-0">Consultorio / Ambiente</th>
                                                <th className="p-3 text-secondary border-0">Fecha</th>
                                                <th className="p-3 text-secondary border-0">Hora Inicio</th>
                                                <th className="p-3 text-secondary border-0">Estado</th>
                                                <th className="p-3 text-secondary border-0">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {turnos.map(t => (
                                                <tr key={t.idProgramacion}>
                                                    <td className="p-3">
                                                        <div className="fw-semibold text-dark">{t.nombreMedico}</div>
                                                        <small className="text-muted">{t.especialidadMedico}</small>
                                                    </td>
                                                    <td className="p-3 text-dark">{t.consultorio ? t.consultorio.nombre : 'Sin consultorio'}</td>
                                                    <td className="p-3 text-dark" style={{ fontVariantNumeric: 'tabular-nums' }}>{t.fecha}</td>
                                                    <td className="p-3 text-dark" style={{ fontVariantNumeric: 'tabular-nums' }}>{t.horaInicio}</td>
                                                    <td className="p-3">
                                                        {renderEstadoBadge(t.estadoTurno)}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="d-flex gap-1">
                                                            <Button variant="outline-primary" size="sm" onClick={() => handleEditarTurno(t)} aria-label={`Editar turno de ${t.nombreMedico}`}>Editar</Button>
                                                            <Button variant="outline-danger" size="sm" onClick={() => handleConfirmarEliminarTurno(t.idProgramacion)} aria-label={`Eliminar turno de ${t.nombreMedico}`}>Eliminar</Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {turnos.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="text-center p-4 text-muted">
                                                        No hay turnos programados en el sistema
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </Tab>

                    {/* TAB 2: CREAR CONSULTORIOS */}
                    <Tab eventKey="consultorios" title="Consultorios">
                        <Row className="g-4 mt-2">
                            <Col md={4}>
                                <div className="bg-light p-4 rounded border">
                                    <h5 className="mb-3">Nuevo Consultorio</h5>
                                    <Form onSubmit={handleGuardarConsultorio} noValidate>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre / Número</Form.Label>
                                            <Form.Control 
                                                type="text"
                                                value={numCons ? `Consultorio ${numCons}` : 'Consultorio '} 
                                                onChange={handleNumConsChange} 
                                                isInvalid={numCons.length > 0 && consultorioExiste}
                                                required 
                                                aria-label="Nombre del consultorio"
                                            />
                                            {consultorioExiste && (
                                                <Form.Control.Feedback type="invalid">
                                                    El consultorio "Consultorio {numCons}" ya se encuentra registrado.
                                                </Form.Control.Feedback>
                                            )}
                                            <Form.Text className="text-muted d-block mt-2" style={{ fontSize: '0.825rem' }}>
                                                💡 Solo ingrese números (ej: 204).
                                            </Form.Text>
                                        </Form.Group>
                                        <Button type="submit" variant="primary" size="sm" className="w-100" disabled={!isConsultorioValid} aria-label="Registrar nuevo consultorio">
                                            Crear
                                        </Button>
                                    </Form>
                                </div>
                            </Col>
                            <Col md={8}>
                                <div className="border rounded overflow-hidden">
                                    <Table hover responsive className="align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="border-0 text-secondary p-3">ID</th>
                                                <th className="border-0 text-secondary p-3">Nombre del Consultorio</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {consultorios.map(c => (
                                                <tr key={c.idConsultorio}>
                                                    <td className="p-3" style={{ fontVariantNumeric: 'tabular-nums' }}>{c.idConsultorio}</td>
                                                    <td className="p-3 fw-bold">{c.nombre}</td>
                                                </tr>
                                            ))}
                                            {consultorios.length === 0 && (
                                                <tr><td colSpan="2" className="text-center p-3 text-muted">No hay consultorios registrados</td></tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    </Tab>
                </Tabs>
            </div>

            {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN DE TURNO */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered aria-labelledby="modal-eliminar-turno-title">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-eliminar-turno-title">Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro de que desea eliminar este turno? Esta acción no se puede deshacer.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={ejecutarEliminacionTurno}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
export default GestionProgramacion;