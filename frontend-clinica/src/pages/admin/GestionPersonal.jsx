import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Container, Table, Button, Modal, Form, Tab, Tabs, Badge, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

const GestionPersonal = () => {
    const [empleados, setEmpleados] = useState([]);
    const [rolSeleccionado, setRolSeleccionado] = useState('DOCTOR');
    const [showModal, setShowModal] = useState(false);

    // Modal de confirmación de eliminación accesible
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idEmpleadoAEliminar, setIdEmpleadoAEliminar] = useState(null);

    const [nuevoEmpleado, setNuevoEmpleado] = useState({
        nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '', telefono: '', correo: '', contraseña: '', especialidad: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        cargarEmpleados();
    }, [rolSeleccionado]);

    const cargarEmpleados = async () => {
        try {
            const response = await api.get(`/personal/listar/${rolSeleccionado}`);
            setEmpleados(response.data);
        } catch (error) {
            console.error(error);
            setEmpleados([]);
        }
    };

    const validateField = (name, value) => {
        let errorMsg = '';
        if (name === 'apellidoPaterno' || name === 'apellidoMaterno') {
            if (value.trim().length < 2 || value.trim().length > 50) {
                errorMsg = "El apellido debe tener entre 2 y 50 caracteres.";
            }
        } else if (name === 'dni') {
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
        } else if (name === 'correo') {
            if (!/\S+@\S+\.\S+/.test(value)) {
                errorMsg = "Ingrese un correo electrónico válido.";
            }
        } else if (name === 'contraseña') {
            if (value.length < 4) {
                errorMsg = "La contraseña debe tener al menos 4 caracteres.";
            }
        } else if (name === 'especialidad' && rolSeleccionado === 'DOCTOR') {
            if (!value) {
                errorMsg = "Debe seleccionar una especialidad médica.";
            }
        }
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
        return errorMsg;
    };

    const isFormValid = () => {
        const isDni = /^\d{8}$/.test(nuevoEmpleado.dni);
        const isNombre = nuevoEmpleado.nombre.trim().length > 0;
        const isPaterno = nuevoEmpleado.apellidoPaterno.trim().length >= 2;
        const isMaterno = nuevoEmpleado.apellidoMaterno.trim().length >= 2;
        const isTel = /^\d{9}$/.test(nuevoEmpleado.telefono);
        const isCorreo = /\S+@\S+\.\S+/.test(nuevoEmpleado.correo);
        const isPass = nuevoEmpleado.contraseña.length >= 4;
        const isEsp = rolSeleccionado !== 'DOCTOR' || !!nuevoEmpleado.especialidad;
        return isDni && isNombre && isPaterno && isMaterno && isTel && isCorreo && isPass && isEsp;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'dni') {
            newValue = value.replace(/\D/g, '').slice(0, 8);
        } else if (name === 'telefono') {
            newValue = value.replace(/\D/g, '').slice(0, 9);
        }
        setNuevoEmpleado(prev => ({ ...prev, [name]: newValue }));
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, newValue);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNuevoEmpleado({
            nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '', telefono: '', correo: '', contraseña: '', especialidad: ''
        });
        setErrors({});
        setTouched({});
    };

    const handleConfirmarEliminar = (id) => {
        setIdEmpleadoAEliminar(id);
        setShowDeleteModal(true);
    };

    const ejecutarEliminacion = async () => {
        if (!idEmpleadoAEliminar) return;
        setShowDeleteModal(false);
        try {
            await api.delete(`/personal/eliminar/${idEmpleadoAEliminar}`);
            toast.success("Personal eliminado con éxito.");
            setIdEmpleadoAEliminar(null);
            cargarEmpleados();
        } catch (error) {
            toast.error("Error al eliminar al personal.");
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isFormValid()) {
            toast.error("Por favor, corrija los campos marcados antes de guardar.");
            return;
        }

        const payload = {
            nombre: nuevoEmpleado.nombre.trim(),
            apellido: `${nuevoEmpleado.apellidoPaterno.trim()} ${nuevoEmpleado.apellidoMaterno.trim()}`,
            dni: nuevoEmpleado.dni,
            correo: nuevoEmpleado.correo.trim(),
            contraseña: nuevoEmpleado.contraseña,
            especialidad: nuevoEmpleado.especialidad,
            rol: rolSeleccionado
        };
        
        try {
            await api.post('/personal/registrar', payload);
            await api.post('/security/registerAsistente', { dni: payload.dni, password: payload.contraseña });
            
            toast.success("Personal registrado con éxito.");
            handleCloseModal();
            cargarEmpleados();
        } catch (error) {
            toast.error("Error al registrar. Verifique si el DNI o correo ya existen.");
            console.error(error);
        }
    };

    return (
        <Container fluid className="p-0">
            <header className="page-header">
                <h1>Gestión de Personal</h1>
            </header>

            <section className="card border-0" aria-label="Gestión de personal médico y administrativo">
                <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Listado de Empleados</h2>
                    <Button variant="primary" size="sm" onClick={() => setShowModal(true)} aria-label={`Registrar nuevo ${rolSeleccionado}`}>
                        + Nuevo {rolSeleccionado}
                    </Button>
                </div>

                <div style={{ padding: '0 var(--space-lg)' }}>
                    <Tabs
                        id="roles-tab"
                        activeKey={rolSeleccionado}
                        onSelect={(k) => setRolSeleccionado(k)}
                        className="mb-0"
                    >
                        <Tab eventKey="DOCTOR" title="Doctores" />
                        <Tab eventKey="ENFERMERA" title="Enfermería" />
                        <Tab eventKey="RECEPCIONISTA" title="Recepción" />
                        <Tab eventKey="CAJERO" title="Cajeros" />
                        <Tab eventKey="ADMIN" title="Administradores" />
                    </Tabs>
                </div>

                <div className="table-scroll">
                    <Table hover responsive className="align-middle mb-0" aria-label="Tabla de empleados registrados">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">DNI</th>
                                <th scope="col">Nombre Completo</th>
                                {rolSeleccionado === 'DOCTOR' && <th scope="col">Especialidad</th>}
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleados.map((emp) => (
                                <tr key={emp.idEmpleado}>
                                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{emp.idEmpleado}</td>
                                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{emp.dni}</td>
                                    <td style={{ fontWeight: 500 }}>{emp.nombre} {emp.apellido}</td>
                                    {rolSeleccionado === 'DOCTOR' && (
                                        <td><Badge bg="info">{emp.especialidad}</Badge></td>
                                    )}
                                    <td>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleConfirmarEliminar(emp.idEmpleado)} aria-label={`Eliminar a ${emp.nombre} ${emp.apellido}`}>Eliminar</Button>
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
            </section>

            {/* MODAL DE REGISTRO */}
            <Modal show={showModal} onHide={handleCloseModal} centered aria-labelledby="modal-registrar-title">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-registrar-title">Registrar Nuevo {rolSeleccionado}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-3">
                            <Form.Label>DNI (8 dígitos)</Form.Label>
                            <Form.Control 
                                name="dni" 
                                required 
                                maxLength="8"
                                inputMode="numeric"
                                onChange={handleChange} 
                                value={nuevoEmpleado.dni} 
                                isInvalid={touched.dni && !!errors.dni}
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
                                isInvalid={touched.nombre && !!errors.nombre}
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
                                        isInvalid={touched.apellidoPaterno && !!errors.apellidoPaterno}
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
                                        isInvalid={touched.apellidoMaterno && !!errors.apellidoMaterno}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.apellidoMaterno}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono (9 dígitos)</Form.Label>
                            <Form.Control 
                                name="telefono" 
                                required 
                                maxLength="9"
                                inputMode="numeric"
                                onChange={handleChange} 
                                value={nuevoEmpleado.telefono} 
                                isInvalid={touched.telefono && !!errors.telefono}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.telefono}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control 
                                name="correo" 
                                type="email" 
                                required 
                                onChange={handleChange} 
                                value={nuevoEmpleado.correo} 
                                isInvalid={touched.correo && !!errors.correo}
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
                                isInvalid={touched.contraseña && !!errors.contraseña}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.contraseña}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {rolSeleccionado === 'DOCTOR' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Especialidad Médica</Form.Label>
                                <Form.Select 
                                    name="especialidad" 
                                    onChange={handleChange} 
                                    value={nuevoEmpleado.especialidad} 
                                    isInvalid={touched.especialidad && !!errors.especialidad}
                                >
                                    <option value="">Seleccione especialidad...</option>
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
                            <Button variant="primary" type="submit" disabled={!isFormValid()}>Guardar</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* MODAL ACCESIBLE DE CONFIRMACIÓN DE ELIMINACIÓN */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered aria-labelledby="modal-eliminar-title">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-eliminar-title">Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro de que desea eliminar a este empleado? Esta acción no se puede deshacer.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={ejecutarEliminacion}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default GestionPersonal;