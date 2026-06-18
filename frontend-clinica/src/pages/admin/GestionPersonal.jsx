import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Container, Table, Button, Modal, Form, Tab, Tabs, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';

const GestionPersonal = () => {
    const [empleados, setEmpleados] = useState([]);
    const [rolSeleccionado, setRolSeleccionado] = useState('DOCTOR'); // Tab activo
    const [showModal, setShowModal] = useState(false);

    // Estado del Formulario
    const [nuevoEmpleado, setNuevoEmpleado] = useState({
        nombre: '', apellido: '', dni: '', correo: '', contraseña: '', especialidad: ''
    });

    // Cargar empleados cuando cambia el tab
    useEffect(() => {
        cargarEmpleados();
    }, [rolSeleccionado]);

    const cargarEmpleados = async () => {
        try {
            const response = await api.get(`/personal/listar/${rolSeleccionado}`);
            setEmpleados(response.data);
        } catch (error) {
            console.error(error);
            setEmpleados([]); // Limpiar si error
        }
    };

    // Manejar inputs del formulario
    const handleChange = (e) => {
        setNuevoEmpleado({ ...nuevoEmpleado, [e.target.name]: e.target.value });
    };

    // Guardar Empleado
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = { ...nuevoEmpleado, rol: rolSeleccionado };
        
        try {
            await api.post('/personal/registrar', payload);
            // Sincronizar credenciales con Seguridad-Server
            await api.post('/security/registerAsistente', { dni: payload.dni, password: payload.contraseña });
            
            toast.success("¡Personal registrado con éxito!");
            setShowModal(false);
            setNuevoEmpleado({ nombre: '', apellido: '', dni: '', correo: '', contraseña: '', especialidad: '' }); // Reset
            cargarEmpleados(); // Recargar lista
        } catch (error) {
            toast.error("Error al registrar. Verifique el DNI y correo.");
            console.error(error);
        }
    };

    return (
        <Container fluid className="p-4">
            <h2 className="mb-4">Gestión de Personal</h2>

            <div className="card-modern p-4 mb-4 shadow-sm bg-white rounded">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Listado de Empleados</h4>
                    <Button className="btn-primary-modern" onClick={() => setShowModal(true)}>
                        + Nuevo {rolSeleccionado}
                    </Button>
                </div>

                {/* SECCIÓN DE TABS ACTUALIZADA */}
                <Tabs
                    id="roles-tab"
                    activeKey={rolSeleccionado}
                    onSelect={(k) => setRolSeleccionado(k)}
                    className="mb-4"
                >
                    <Tab eventKey="DOCTOR" title="Doctores" />
                    
                    {/* --- AGREGADO AQUÍ --- */}
                    <Tab eventKey="ENFERMERA" title="Enfermería" />

                    <Tab eventKey="RECEPCIONISTA" title="Recepción" />
                    <Tab eventKey="CAJERO" title="Cajeros" />
                    <Tab eventKey="ADMIN" title="Administradores" />
                </Tabs>

                <Table hover responsive className="align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th className="border-0 text-secondary">ID</th>
                            <th className="border-0 text-secondary">DNI</th>
                            <th className="border-0 text-secondary">Nombre Completo</th>
                            {/* Solo los doctores muestran especialidad */}
                            {rolSeleccionado === 'DOCTOR' && <th className="border-0 text-secondary">Especialidad</th>}
                            <th className="border-0 text-secondary">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empleados.map((emp) => (
                            <tr key={emp.idEmpleado}>
                                <td>{emp.idEmpleado}</td>
                                <td>{emp.dni}</td>
                                <td className="fw-bold">{emp.nombre} {emp.apellido}</td>
                                {rolSeleccionado === 'DOCTOR' && (
                                    <td><Badge bg="info" className="fw-normal">{emp.especialidad}</Badge></td>
                                )}
                                <td>
                                    <Button variant="outline-danger" size="sm">Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                        {empleados.length === 0 && (
                            <tr>
                                <td colSpan={rolSeleccionado === 'DOCTOR' ? 5 : 4} className="text-center py-4 text-muted">
                                    No hay registros en esta categoría
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* MODAL DE REGISTRO */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Nuevo {rolSeleccionado}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>DNI</Form.Label>
                            <Form.Control name="dni" required onChange={handleChange} value={nuevoEmpleado.dni} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control name="nombre" required onChange={handleChange} value={nuevoEmpleado.nombre} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control name="apellido" required onChange={handleChange} value={nuevoEmpleado.apellido} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control name="correo" type="email" required onChange={handleChange} value={nuevoEmpleado.correo} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control name="contraseña" type="password" required onChange={handleChange} value={nuevoEmpleado.contraseña} />
                        </Form.Group>

                        {/* La especialidad seguirá apareciendo SOLO si es DOCTOR */}
                        {rolSeleccionado === 'DOCTOR' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Especialidad</Form.Label>
                                <Form.Select name="especialidad" onChange={handleChange} value={nuevoEmpleado.especialidad}>
                                    <option value="">Seleccione...</option>
                                    <option value="Cardiologia">Cardiología</option>
                                    <option value="Pediatria">Pediatría</option>
                                    <option value="General">Medicina General</option>
                                    <option value="Dermatologia">Dermatología</option>
                                </Form.Select>
                            </Form.Group>
                        )}

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                            <Button className="btn-primary-modern" type="submit">Guardar</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default GestionPersonal;