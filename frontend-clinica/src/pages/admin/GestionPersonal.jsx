import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Container, Table, Button, Modal, Form, Tab, Tabs, Badge, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

const GestionPersonal = () => {
    const [empleados, setEmpleados] = useState([]);
    const [rolSeleccionado, setRolSeleccionado] = useState('DOCTOR'); // Tab activo
    const [showModal, setShowModal] = useState(false);

    // Estado del Formulario
    const [nuevoEmpleado, setNuevoEmpleado] = useState({
        nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '', telefono: '', correo: '', contraseña: '', especialidad: ''
    });

    const [errors, setErrors] = useState({});

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

    const validateField = (name, value) => {
        let errorMsg = '';
        if (name === 'apellidoPaterno' || name === 'apellidoMaterno') {
            if (value.length < 2 || value.length > 50) {
                errorMsg = "El apellido debe tener entre 2 y 50 caracteres";
            }
        } else if (name === 'dni') {
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
        } else if (name === 'correo') {
            if (!/\S+@\S+\.\S+/.test(value)) {
                errorMsg = "El correo no es válido";
            }
        } else if (name === 'contraseña') {
            if (value.length < 4) {
                errorMsg = "La contraseña debe tener al menos 4 caracteres";
            }
        }
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
        return errorMsg;
    };

    // Manejar inputs del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'dni' || name === 'telefono') {
            newValue = value.replace(/\D/g, '');
        }
        setNuevoEmpleado(prev => ({ ...prev, [name]: newValue }));
        validateField(name, newValue);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNuevoEmpleado({
            nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '', telefono: '', correo: '', contraseña: '', especialidad: ''
        });
        setErrors({});
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Está seguro de que desea eliminar a este empleado?")) {
            try {
                await api.delete(`/personal/eliminar/${id}`);
                toast.success("¡Personal eliminado con éxito!");
                cargarEmpleados();
            } catch (error) {
                toast.error("Error al eliminar al personal.");
                console.error(error);
            }
        }
    };

    // Guardar Empleado
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar todos los campos antes de enviar
        const fieldsToValidate = ['dni', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'telefono', 'correo', 'contraseña'];
        let formIsValid = true;
        const newErrors = {};
        
        fieldsToValidate.forEach(field => {
            let value = nuevoEmpleado[field] || '';
            let errorMsg = '';
            if (field === 'apellidoPaterno' || field === 'apellidoMaterno') {
                if (value.length < 2 || value.length > 50) {
                    errorMsg = "El apellido debe tener entre 2 y 50 caracteres";
                }
            } else if (field === 'dni') {
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
            } else if (field === 'correo') {
                if (!/\S+@\S+\.\S+/.test(value)) {
                    errorMsg = "El correo no es válido";
                }
            } else if (field === 'contraseña') {
                if (value.length < 4) {
                    errorMsg = "La contraseña debe tener al menos 4 caracteres";
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
            nombre: nuevoEmpleado.nombre,
            apellido: `${nuevoEmpleado.apellidoPaterno} ${nuevoEmpleado.apellidoMaterno}`,
            dni: nuevoEmpleado.dni,
            correo: nuevoEmpleado.correo,
            contraseña: nuevoEmpleado.contraseña,
            especialidad: nuevoEmpleado.especialidad,
            rol: rolSeleccionado
        };
        
        try {
            await api.post('/personal/registrar', payload);
            // Sincronizar credenciales con Seguridad-Server
            await api.post('/security/registerAsistente', { dni: payload.dni, password: payload.contraseña });
            
            toast.success("¡Personal registrado con éxito!");
            setShowModal(false);
            setNuevoEmpleado({
                nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '', telefono: '', correo: '', contraseña: '', especialidad: ''
            }); // Reset
            setErrors({});
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
                                    <Button variant="outline-danger" size="sm" onClick={() => handleEliminar(emp.idEmpleado)}>Eliminar</Button>
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
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Nuevo {rolSeleccionado}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-3">
                            <Form.Label>DNI</Form.Label>
                            <Form.Control 
                                name="dni" 
                                required 
                                maxLength="8"
                                onChange={handleChange} 
                                value={nuevoEmpleado.dni} 
                                isInvalid={!!errors.dni}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.dni}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombres</Form.Label>
                            <Form.Control 
                                name="nombre" 
                                required 
                                onChange={handleChange} 
                                value={nuevoEmpleado.nombre} 
                                isInvalid={!!errors.nombre}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.nombre}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido Paterno</Form.Label>
                                    <Form.Control 
                                        name="apellidoPaterno" 
                                        required 
                                        maxLength="50"
                                        onChange={handleChange} 
                                        value={nuevoEmpleado.apellidoPaterno} 
                                        isInvalid={!!errors.apellidoPaterno}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.apellidoPaterno}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido Materno</Form.Label>
                                    <Form.Control 
                                        name="apellidoMaterno" 
                                        required 
                                        maxLength="50"
                                        onChange={handleChange} 
                                        value={nuevoEmpleado.apellidoMaterno} 
                                        isInvalid={!!errors.apellidoMaterno}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.apellidoMaterno}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control 
                                name="telefono" 
                                required 
                                maxLength="9"
                                onChange={handleChange} 
                                value={nuevoEmpleado.telefono} 
                                isInvalid={!!errors.telefono}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.telefono}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control 
                                name="correo" 
                                type="email" 
                                required 
                                onChange={handleChange} 
                                value={nuevoEmpleado.correo} 
                                isInvalid={!!errors.correo}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.correo}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control 
                                name="contraseña" 
                                type="password" 
                                required 
                                onChange={handleChange} 
                                value={nuevoEmpleado.contraseña} 
                                isInvalid={!!errors.contraseña}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.contraseña}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* La especialidad seguirá apareciendo SOLO si es DOCTOR */}
                        {rolSeleccionado === 'DOCTOR' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Especialidad</Form.Label>
                                <Form.Select name="especialidad" onChange={handleChange} value={nuevoEmpleado.especialidad} isInvalid={!!errors.especialidad}>
                                    <option value="">Seleccione...</option>
                                    <option value="Cardiologia">Cardiología</option>
                                    <option value="Pediatria">Pediatría</option>
                                    <option value="General">Medicina General</option>
                                    <option value="Dermatologia">Dermatología</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.especialidad}
                                </Form.Control.Feedback>
                            </Form.Group>
                        )}

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                            <Button className="btn-primary-modern" type="submit">Guardar</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default GestionPersonal;