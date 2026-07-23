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

    // --- ESTADOS PROGRAMACIÓN ---
    const [especialidad, setEspecialidad] = useState('');
    const [horarios, setHorarios] = useState([]);

    // 1. BUSCAR PACIENTE
    const buscarPaciente = async () => {
        if(!dniBusqueda) return toast.warning("Ingrese un DNI");
        try {
            const res = await api.get(`/paciente/buscar/${dniBusqueda}`);
            setPacienteEncontrado(res.data);
            toast.success("Paciente encontrado");
        } catch (error) {
            setPacienteEncontrado(null);
            toast.info("Paciente no encontrado. Puede registrarlo ahora.");
            setFormPaciente({ ...formPaciente, documento: dniBusqueda });
        }
    };

    const validatePacienteField = (name, value) => {
        let errorMsg = '';
        if (name === 'apellidoPaterno' || name === 'apellidoMaterno') {
            if (value.length < 2 || value.length > 50) {
                errorMsg = "El apellido debe tener entre 2 y 50 caracteres";
            }
        } else if (name === 'documento') {
            if (!/^\d{8}$/.test(value)) {
                errorMsg = "El DNI debe tener exactamente 8 dígitos numéricos";
            }
        } else if (name === 'telefono') {
            if (!/^\d{9}$/.test(value)) {
                errorMsg = "El teléfono debe tener exactamente 9 dígitos numéricos";
            }
        } else if (name === 'nombre') {
            if (value.trim().length === 0) {
                errorMsg = "El nombre es requerido";
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
    };

    // 2. REGISTRAR PACIENTE NUEVO (MODAL)
    const handleRegistrarPaciente = async (e) => {
        e.preventDefault();
        
        const fieldsToValidate = ['documento', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'telefono'];
        let formIsValid = true;
        const newErrors = {};
        
        fieldsToValidate.forEach(field => {
            let value = formPaciente[field] || '';
            let errorMsg = '';
            if (field === 'apellidoPaterno' || field === 'apellidoMaterno') {
                if (value.length < 2 || value.length > 50) {
                    errorMsg = "El apellido debe tener entre 2 y 50 caracteres";
                }
            } else if (field === 'documento') {
                if (!/^\d{8}$/.test(value)) {
                    errorMsg = "El DNI debe tener exactamente 8 dígitos numéricos";
                }
            } else if (field === 'telefono') {
                if (!/^\d{9}$/.test(value)) {
                    errorMsg = "El teléfono debe tener exactamente 9 dígitos numéricos";
                }
            } else if (field === 'nombre') {
                if (value.trim().length === 0) {
                    errorMsg = "El nombre es requerido";
                }
            }
            if (errorMsg) {
                newErrors[field] = errorMsg;
                formIsValid = false;
            }
        });
        
        setErrors(newErrors);
        
        if (!formIsValid) {
            toast.error("Por favor, corrija los errores en el formulario.");
            return;
        }

        const payload = {
            documento: formPaciente.documento,
            nombre: formPaciente.nombre,
            apellido: `${formPaciente.apellidoPaterno} ${formPaciente.apellidoMaterno}`,
            fechaNac: formPaciente.fechaNac,
            telefono: formPaciente.telefono
        };

        try {
            const res = await api.post('/paciente/registrar', payload);
            setPacienteEncontrado(res.data);
            setShowModal(false);
            setFormPaciente({
                documento: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '', fechaNac: '', telefono: ''
            });
            setErrors({});
            toast.success("Paciente registrado y seleccionado.");
        } catch (error) {
            toast.error("Error al registrar paciente.");
            console.error(error);
        }
    };
    
    // 3. BUSCAR HORARIOS
    const buscarHorarios = async () => {
        if(!especialidad) return;
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
            toast.success("Cita Agendada Exitosamente.");
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
                                    placeholder="Ingrese DNI" 
                                    value={dniBusqueda} 
                                    onChange={e => setDniBusqueda(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && buscarPaciente()}
                                    aria-label="Ingresar DNI del Paciente para buscar"
                                />
                                <Button variant="outline-primary" onClick={buscarPaciente} aria-label="Buscar paciente por DNI">
                                    Buscar
                                </Button>
                            </div>

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
                                <Button onClick={buscarHorarios} variant="primary" size="sm" style={{ whiteSpace: 'nowrap' }} aria-label="Buscar horarios de turnos disponibles">Buscar Disponibles</Button>
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
                                    <Form.Label>DNI / Documento</Form.Label>
                                    <Form.Control required 
                                        maxLength="8"
                                        value={formPaciente.documento} 
                                        onChange={e => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            setFormPaciente({...formPaciente, documento: val});
                                            validatePacienteField('documento', val);
                                        }} 
                                        isInvalid={!!errors.documento}
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
                                    <Form.Control type="date" required 
                                        value={formPaciente.fechaNac} 
                                        onChange={e => setFormPaciente({...formPaciente, fechaNac: e.target.value})} 
                                        aria-label="Ingresar fecha de nacimiento del nuevo paciente"
                                    />
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
                                    validatePacienteField('nombre', val);
                                }} 
                                isInvalid={!!errors.nombre}
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
                                            validatePacienteField('apellidoPaterno', val);
                                        }} 
                                        isInvalid={!!errors.apellidoPaterno}
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
                                            validatePacienteField('apellidoMaterno', val);
                                        }} 
                                        isInvalid={!!errors.apellidoMaterno}
                                        aria-label="Ingresar apellido materno del nuevo paciente"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.apellidoMaterno}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control placeholder="999..." required 
                                maxLength="9"
                                value={formPaciente.telefono} 
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setFormPaciente({...formPaciente, telefono: val});
                                    validatePacienteField('telefono', val);
                                }} 
                                isInvalid={!!errors.telefono}
                                aria-label="Ingresar teléfono del nuevo paciente"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.telefono}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={handleCloseModal} aria-label="Cerrar registro de paciente">Cancelar</Button>
                            <Button type="submit" variant="primary" aria-label="Guardar y seleccionar paciente registrado">Guardar y Seleccionar</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AgendarCitaPage;