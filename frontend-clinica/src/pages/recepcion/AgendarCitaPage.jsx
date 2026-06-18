import { useState, useContext } from 'react';
import api from '../../config/axios';
import { AuthContext } from '../../context/AuthProvider';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaUserPlus, FaSearch, FaCalendarCheck } from 'react-icons/fa';

const AgendarCitaPage = () => {
    const { user } = useContext(AuthContext);

    // --- ESTADOS PACIENTE ---
    const [dniBusqueda, setDniBusqueda] = useState('');
    const [pacienteEncontrado, setPacienteEncontrado] = useState(null);
    const [showModal, setShowModal] = useState(false); // Control del Modal
    
    // Formulario Nuevo Paciente
    const [formPaciente, setFormPaciente] = useState({
        documento: '', nombre: '', fechaNac: '', telefono: ''
    });

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
            // Si no encuentra, sugerimos registrar
            toast.info("Paciente no encontrado. Puede registrarlo ahora.");
            // Pre-llenamos el DNI en el formulario de registro para ahorrar tiempo
            setFormPaciente({ ...formPaciente, documento: dniBusqueda });
        }
    };

    // 2. REGISTRAR PACIENTE NUEVO (MODAL)
    const handleRegistrarPaciente = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/paciente/registrar', formPaciente);
            // MAGIA: Una vez registrado, lo seleccionamos automáticamente
            setPacienteEncontrado(res.data);
            setShowModal(false);
            toast.success("¡Paciente registrado y seleccionado!");
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
            idEncargado: user.id // ID del usuario logueado
        };

        try {
            await api.post('/cita/registrar', payload);
            toast.success("¡Cita Agendada Exitosamente!");
            buscarHorarios(); // Refrescar tabla
            // Opcional: Limpiar todo para el siguiente paciente
            // setPacienteEncontrado(null);
            // setDniBusqueda('');
        } catch (error) {
            toast.error("Error al agendar la cita.");
            console.error(error);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="text-secondary mb-4"><FaCalendarCheck/> Gestión de Citas</h2>
            
            <Row>
                {/* --- COLUMNA IZQUIERDA: PACIENTE --- */}
                <Col md={4}>
                    <Card className="shadow-sm mb-4 border-0">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">1. Identificar Paciente</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="input-group mb-3">
                                <Form.Control 
                                    placeholder="Ingrese DNI" 
                                    value={dniBusqueda} 
                                    onChange={e => setDniBusqueda(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && buscarPaciente()}
                                />
                                <Button variant="outline-primary" onClick={buscarPaciente}>
                                    <FaSearch/>
                                </Button>
                            </div>

                            {pacienteEncontrado ? (
                                <Alert variant="success" className="text-center">
                                    <h5>{pacienteEncontrado.nombre}</h5>
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
                                    <Button variant="success" className="w-100" onClick={() => setShowModal(true)}>
                                        <FaUserPlus className="me-2"/> Registrar Nuevo Paciente
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* --- COLUMNA DERECHA: HORARIOS --- */}
                <Col md={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-secondary text-white">
                            <h5 className="mb-0">2. Seleccionar Horario</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex gap-3 align-items-center mb-4 bg-light p-3 rounded">
                                <Form.Select value={especialidad} onChange={e => setEspecialidad(e.target.value)}>
                                    <option value="">Filtrar por Especialidad...</option>
                                    <option value="Cardiologia">Cardiología</option>
                                    <option value="Pediatria">Pediatría</option>
                                    <option value="General">Medicina General</option>
                                    <option value="Dermatologia">Dermatología</option>
                                </Form.Select>
                                <Button onClick={buscarHorarios} variant="dark">Buscar Disponibles</Button>
                            </div>

                            <Table hover responsive className="align-middle">
                                <thead className="table-light">
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
                                            <td>{h.fecha}</td>
                                            <td className="fw-bold text-primary">{h.horaInicio}</td>
                                            <td>{h.nombreMedico}</td>
                                            <td><span className="badge bg-info text-dark">{h.consultorio?.nombre}</span></td>
                                            <td>
                                                <Button size="sm" variant="success" 
                                                    disabled={!pacienteEncontrado}
                                                    onClick={() => handleAgendar(h.idProgramacion)}>
                                                    Reservar Cita
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {horarios.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">Seleccione una especialidad para ver horarios disponibles.</td></tr>}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* --- MODAL REGISTRO RÁPIDO --- */}
            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static">
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title><FaUserPlus/> Nuevo Paciente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleRegistrarPaciente}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>DNI / Documento</Form.Label>
                                    <Form.Control required 
                                        value={formPaciente.documento} 
                                        onChange={e => setFormPaciente({...formPaciente, documento: e.target.value})} 
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha Nacimiento</Form.Label>
                                    <Form.Control type="date" required 
                                        value={formPaciente.fechaNac} 
                                        onChange={e => setFormPaciente({...formPaciente, fechaNac: e.target.value})} 
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control placeholder="Ej: Juan Perez" required 
                                value={formPaciente.nombre} 
                                onChange={e => setFormPaciente({...formPaciente, nombre: e.target.value})} 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control placeholder="999..." required 
                                value={formPaciente.telefono} 
                                onChange={e => setFormPaciente({...formPaciente, telefono: e.target.value})} 
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                            <Button type="submit" variant="success">Guardar y Seleccionar</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

        </Container>
    );
};

export default AgendarCitaPage;