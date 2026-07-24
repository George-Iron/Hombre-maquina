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

    // Estado para edición
    const [modoEditar, setModoEditar] = useState(false);
    const [idEmpleadoEditar, setIdEmpleadoEditar] = useState(null);

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
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                errorMsg = "El apellido solo debe contener letras (sin números).";
            }
        } else if (name === 'dni') {
            if (!/^\d{8}$/.test(value)) {
                errorMsg = "El DNI debe tener exactamente 8 dígitos numéricos.";
            }
        } else if (name === 'telefono') {
            if (!/^9\d{8}$/.test(value)) {
                errorMsg = "El teléfono debe comenzar obligatoriamente con 9 y tener 9 dígitos.";
            }
        } else if (name === 'nombre') {
            if (value.trim().length === 0) {
                errorMsg = "El nombre es requerido.";
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                errorMsg = "El nombre solo debe contener letras (sin números).";
            }
        } else if (name === 'correo') {
            if (!/\S+@\S+\.\S+/.test(value)) {
                errorMsg = "Ingrese un correo electrónico válido.";
            }
        } else if (name === 'contraseña') {
            if (!modoEditar && value.length < 4) {
                errorMsg = "La contraseña debe tener al menos 4 caracteres.";
            } else if (modoEditar && value.length > 0 && value.length < 4) {
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
        const isNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(nuevoEmpleado.nombre.trim());
        const isPaterno = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(nuevoEmpleado.apellidoPaterno.trim());
        const isMaterno = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(nuevoEmpleado.apellidoMaterno.trim());
        const isTel = /^9\d{8}$/.test(nuevoEmpleado.telefono);
        const isCorreo = /\S+@\S+\.\S+/.test(nuevoEmpleado.correo);
        const isPass = modoEditar
            ? (nuevoEmpleado.contraseña.length === 0 || nuevoEmpleado.contraseña.length >= 4)
            : nuevoEmpleado.contraseña.length >= 4;
        const isEsp = rolSeleccionado !== 'DOCTOR' || !!nuevoEmpleado.especialidad;
        return isDni && isNombre && isPaterno && isMaterno && isTel && isCorreo && isPass && isEsp;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'nombre' || name === 'apellidoPaterno' || name === 'apellidoMaterno') {
            newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        } else if (name === 'dni') {
            newValue = value.replace(/\D/g, '').slice(0, 8);
        } else if (name === 'telefono') {
            let digits = value.replace(/\D/g, '');
            if (digits.length > 0 && digits[0] !== '9') {
                digits = '';
            }
            newValue = digits.slice(0, 9);
        }
        setNuevoEmpleado(prev => ({ ...prev, [name]: newValue }));
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, newValue);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModoEditar(false);
        setIdEmpleadoEditar(null);
        setNuevoEmpleado({
            nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '', telefono: '', correo: '', contraseña: '', especialidad: ''
        });
        setErrors({});
        setTouched({});
    };

    const handleEditar = (emp) => {
        const partes = (emp.apellido || '').split(' ');
        const apellidoPaterno = partes[0] || '';
        const apellidoMaterno = partes.slice(1).join(' ') || '';
        setNuevoEmpleado({
            nombre: emp.nombre || '',
            apellidoPaterno,
            apellidoMaterno,
            dni: emp.dni || '',
            telefono: emp.telefono || '',
            correo: emp.correo || '',
            contraseña: '',
            especialidad: emp.especialidad || ''
        });
        setModoEditar(true);
        setIdEmpleadoEditar(emp.idEmpleado);
        setShowModal(true);
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
            especialidad: nuevoEmpleado.especialidad,
            rol: rolSeleccionado
        };

        if (nuevoEmpleado.contraseña) {
            payload.contraseña = nuevoEmpleado.contraseña;
        }
        
        try {
            if (modoEditar) {
                await api.put(`/personal/actualizar/${idEmpleadoEditar}`, payload);
                toast.success("Personal actualizado con éxito.");
            } else {
                payload.contraseña = nuevoEmpleado.contraseña;
                await api.post('/personal/registrar', payload);
                await api.post('/security/registerAsistente', { dni: payload.dni, password: nuevoEmpleado.contraseña });
                toast.success("Personal registrado con éxito.");
            }
            handleCloseModal();
            cargarEmpleados();
        } catch (error) {
            toast.error(modoEditar ? "Error al actualizar el personal." : "Error al registrar. Verifique si el DNI o correo ya existen.");
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
                                        <div className="d-flex gap-1">
                                            <Button variant="outline-primary" size="sm" onClick={() => handleEditar(emp)} aria-label={`Editar a ${emp.nombre} ${emp.apellido}`}>Editar</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleConfirmarEliminar(emp.idEmpleado)} aria-label={`Eliminar a ${emp.nombre} ${emp.apellido}`}>Eliminar</Button>
                                        </div>
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

            {/* MODAL DE REGISTRO / EDICIÓN */}
            <Modal show={showModal} onHide={handleCloseModal} centered aria-labelledby="modal-registrar-title">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-registrar-title">{modoEditar ? `Editar ${rolSeleccionado}` : `Registrar Nuevo ${rolSeleccionado}`}</Modal.Title>
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
                                readOnly={modoEditar}
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
                            <Form.Label>{modoEditar ? 'Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}</Form.Label>
                            <Form.Control 
                                name="contraseña" 
                                type="password" 
                                required={!modoEditar}
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
                            <Button variant="primary" type="submit" disabled={!isFormValid()}>{modoEditar ? 'Actualizar' : 'Guardar'}</Button>
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