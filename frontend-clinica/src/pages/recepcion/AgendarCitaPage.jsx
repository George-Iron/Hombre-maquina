import { useState, useContext } from 'react';
import api from '../../config/axios';
import { AuthContext } from '../../context/AuthProvider';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const AgendarCitaPage = () => {
    const { user } = useContext(AuthContext);

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

    const todayStr = new Date().toISOString().split('T')[0];

    const isDniSearchValid = /^\d{8}$/.test(dniBusqueda);

    const isFormPacienteValid = () => {
        const isDoc = /^\d{8}$/.test(formPaciente.documento);
        const isNom = formPaciente.nombre.trim().length > 0;
        const isPat = formPaciente.apellidoPaterno.trim().length >= 2;
        const isMat = formPaciente.apellidoMaterno.trim().length >= 2;
        const isTel = /^\d{9}$/.test(formPaciente.telefono);
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
        }
    };

    const validatePacienteField = (name, value) => {
        let errorMsg = '';
        if (name === 'apellidoPaterno' || name === 'apellidoMaterno') {
            if (value.trim().length < 2 || value.trim().length > 50) {
                errorMsg = "El apellido debe tener entre 2 y 50 caracteres.";
            }
        } else if (name === 'documento') {
            if (!/^\d{8}$/.test(value)) {
                errorMsg = "El DNI debe tener exactamente 8 dígitos numéricos.";
            }
        } else if (name === 'telefono') {
            if (!/^\d{9}$/.test(value)) {
                errorMsg = "El teléfono debe tener exactamente 9 dígitos numéricos.";
            }
        } else if (name === 'nombre') {
            if (value.trim().length === 0) {
                errorMsg = "El nombre es requerido.";
            }
        } else if (name === 'fechaNac') {
            if (!value || value > todayStr || value < '1900-01-01') {
                errorMsg = "La fecha de nacimiento debe ser válida y no puede ser futura.";
            }
        }
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
        return errorMsg;
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormPaciente({
            documento: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '', fechaNac: '', telefono: ''
        });
        setErrors({});
        setTouched({});
    };

    // 2. REGISTRAR PACIENTE NUEVO (MODAL)
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
    
    // 3. BUSCAR HORARIOS
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

    return (
        <Container className="p-0">
            <div className="page-header">
                <h2>Gestión de Citas</h2>
                <p>Búsqueda de paciente y reserva de horario de atención.</p>
            </div>
            
            <Row className="g-3">
                {/* --- COLUMNA IZQUIERDA: PACIENTE --- */}
                <Col md={4}>
                    <Card className="border-0 mb-4">
                        <Card.Header>
                            <h5 className="mb-0">1. Identificar Paciente</h5>
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
                                    <h5 style={{ fontFamily: 'var(--font-serif)' }}>{pacienteEncontrado.nombre}</h5>
                                    <small>DNI: {pacienteEncontrado.documento}</small><br/>
                                    <small>Tel: {pacienteEncontrado.telefono}</small>
                                    <div className="mt-2">
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
                    <Card className="border-0">
                        <Card.Header>
                            <h5 className="mb-0">2. Seleccionar Horario</h5>
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
                                        {horarios.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">Seleccione una especialidad para ver horarios disponibles.</td></tr>}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* --- MODAL REGISTRO RÁPIDO --- */}
            <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Paciente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleRegistrarPaciente} noValidate>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>DNI / Documento (8 dígitos)</Form.Label>
                                    <Form.Control required 
                                        maxLength="8"
                                        inputMode="numeric"
                                        value={formPaciente.documento} 
                                        onChange={e => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 8);
                                            setFormPaciente({...formPaciente, documento: val});
                                            setTouched({...touched, documento: true});
                                            validatePacienteField('documento', val);
                                        }} 
                                        isInvalid={touched.documento && !!errors.documento}
                                        aria-label="Ingresar DNI o Documento de Identidad del nuevo paciente"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.documento}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha Nacimiento</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        required 
                                        max={todayStr}
                                        min="1900-01-01"
                                        value={formPaciente.fechaNac} 
                                        onChange={e => {
                                            const val = e.target.value;
                                            setFormPaciente({...formPaciente, fechaNac: val});
                                            setTouched({...touched, fechaNac: true});
                                            validatePacienteField('fechaNac', val);
                                        }} 
                                        isInvalid={touched.fechaNac && !!errors.fechaNac}
                                        aria-label="Ingresar fecha de nacimiento del nuevo paciente"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.fechaNac}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Nombres</Form.Label>
                            <Form.Control placeholder="Ej: Juan" required 
                                value={formPaciente.nombre} 
                                onChange={e => {
                                    const val = e.target.value;
                                    setFormPaciente({...formPaciente, nombre: val});
                                    setTouched({...touched, nombre: true});
                                    validatePacienteField('nombre', val);
                                }} 
                                isInvalid={touched.nombre && !!errors.nombre}
                                aria-label="Ingresar nombres del nuevo paciente"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.nombre}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido Paterno</Form.Label>
                                    <Form.Control placeholder="Ej: Perez" required 
                                        maxLength="50"
                                        value={formPaciente.apellidoPaterno} 
                                        onChange={e => {
                                            const val = e.target.value;
                                            setFormPaciente({...formPaciente, apellidoPaterno: val});
                                            setTouched({...touched, apellidoPaterno: true});
                                            validatePacienteField('apellidoPaterno', val);
                                        }} 
                                        isInvalid={touched.apellidoPaterno && !!errors.apellidoPaterno}
                                        aria-label="Ingresar apellido paterno del nuevo paciente"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.apellidoPaterno}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido Materno</Form.Label>
                                    <Form.Control placeholder="Ej: Gomez" required 
                                        maxLength="50"
                                        value={formPaciente.apellidoMaterno} 
                                        onChange={e => {
                                            const val = e.target.value;
                                            setFormPaciente({...formPaciente, apellidoMaterno: val});
                                            setTouched({...touched, apellidoMaterno: true});
                                            validatePacienteField('apellidoMaterno', val);
                                        }} 
                                        isInvalid={touched.apellidoMaterno && !!errors.apellidoMaterno}
                                        aria-label="Ingresar apellido materno del nuevo paciente"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.apellidoMaterno}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono (9 dígitos)</Form.Label>
                            <Form.Control placeholder="999..." required 
                                maxLength="9"
                                inputMode="numeric"
                                value={formPaciente.telefono} 
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                    setFormPaciente({...formPaciente, telefono: val});
                                    setTouched({...touched, telefono: true});
                                    validatePacienteField('telefono', val);
                                }} 
                                isInvalid={touched.telefono && !!errors.telefono}
                                aria-label="Ingresar teléfono del nuevo paciente"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.telefono}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={handleCloseModal} aria-label="Cerrar registro de paciente">Cancelar</Button>
                            <Button type="submit" variant="primary" disabled={!isFormPacienteValid()} aria-label="Guardar y seleccionar paciente registrado">Guardar y Seleccionar</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AgendarCitaPage;