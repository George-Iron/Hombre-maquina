import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Container, Table, Button, Modal, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ExpedienteModal from '../../components/ExpedienteModal';

const GestionPacientes = () => {
    const [pacientes, setPacientes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Estados para edición
    const [modoEditar, setModoEditar] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    // Estados para eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idEliminar, setIdEliminar] = useState(null);

    // Estados para Expediente 360°
    const [showExpedienteModal, setShowExpedienteModal] = useState(false);
    const [dniExpediente, setDniExpediente] = useState('');

    const [formPaciente, setFormPaciente] = useState({
        documento: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        fechaNac: '',
        telefono: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const todayStr = new Date().toISOString().split('T')[0];

    useEffect(() => {
        cargarPacientes();
    }, []);

    const cargarPacientes = async () => {
        try {
            const res = await api.get('/paciente/listar');
            setPacientes(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar la lista de pacientes.");
            setPacientes([]);
        }
    };

    const validateField = (name, value) => {
        let errorMsg = '';
        if (name === 'documento') {
            if (!/^\d{8}$/.test(value)) {
                errorMsg = "El DNI debe tener exactamente 8 dígitos numéricos.";
            }
        } else if (name === 'nombre') {
            if (value.trim().length === 0) {
                errorMsg = "El nombre es requerido.";
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                errorMsg = "El nombre solo debe contener letras (sin números).";
            }
        } else if (name === 'apellidoPaterno' || name === 'apellidoMaterno') {
            if (value.trim().length < 2 || value.trim().length > 50) {
                errorMsg = "El apellido debe tener entre 2 y 50 caracteres.";
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                errorMsg = "El apellido solo debe contener letras (sin números).";
            }
        } else if (name === 'telefono') {
            if (!/^9\d{8}$/.test(value)) {
                errorMsg = "El teléfono debe comenzar obligatoriamente con 9 y tener 9 dígitos.";
            }
        } else if (name === 'fechaNac') {
            if (!value) {
                errorMsg = "La fecha de nacimiento es requerida.";
            } else if (value > todayStr) {
                errorMsg = "La fecha de nacimiento no puede ser futura.";
            }
        }
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
        return errorMsg;
    };

    const isFormPacienteValid = () => {
        const isDoc = /^\d{8}$/.test(formPaciente.documento);
        const isNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(formPaciente.nombre.trim());
        const isPaterno = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(formPaciente.apellidoPaterno.trim());
        const isMaterno = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(formPaciente.apellidoMaterno.trim());
        const isTel = /^9\d{8}$/.test(formPaciente.telefono);
        const isFecha = formPaciente.fechaNac && formPaciente.fechaNac <= todayStr;
        return isDoc && isNombre && isPaterno && isMaterno && isTel && isFecha;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'nombre' || name === 'apellidoPaterno' || name === 'apellidoMaterno') {
            newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        } else if (name === 'documento') {
            newValue = value.replace(/\D/g, '').slice(0, 8);
        } else if (name === 'telefono') {
            let digits = value.replace(/\D/g, '');
            if (digits.length > 0 && digits[0] !== '9') {
                digits = '';
            }
            newValue = digits.slice(0, 9);
        }
        setFormPaciente(prev => ({ ...prev, [name]: newValue }));
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, newValue);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModoEditar(false);
        setIdEditar(null);
        setFormPaciente({
            documento: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '', fechaNac: '', telefono: ''
        });
        setErrors({});
        setTouched({});
    };

    const handleEditar = (p) => {
        const partes = (p.apellido || '').split(' ');
        const apellidoPaterno = partes[0] || '';
        const apellidoMaterno = partes.slice(1).join(' ') || '';
        setFormPaciente({
            documento: p.documento || '',
            nombre: p.nombre || '',
            apellidoPaterno,
            apellidoMaterno,
            fechaNac: p.fechaNac || '',
            telefono: p.telefono || ''
        });
        setModoEditar(true);
        setIdEditar(p.idPaciente);
        setShowModal(true);
        setErrors({});
        setTouched({});
    };

    const handleConfirmarEliminar = (id) => {
        setIdEliminar(id);
        setShowDeleteModal(true);
    };

    const ejecutarEliminacion = async () => {
        if (!idEliminar) return;
        setShowDeleteModal(false);
        try {
            await api.delete(`/paciente/eliminar/${idEliminar}`);
            toast.success("Paciente eliminado con éxito.");
            setIdEliminar(null);
            cargarPacientes();
        } catch (error) {
            toast.error("Error al eliminar el paciente.");
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isFormPacienteValid()) {
            toast.error("Por favor, corrija los campos marcados antes de guardar.");
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
            if (modoEditar) {
                await api.put(`/paciente/actualizar/${idEditar}`, payload);
                toast.success("Paciente actualizado con éxito.");
            } else {
                await api.post('/paciente/registrar', payload);
                toast.success("Paciente registrado con éxito.");
            }
            handleCloseModal();
            cargarPacientes();
        } catch (error) {
            toast.error(modoEditar ? "Error al actualizar paciente." : "Error al registrar paciente. Verifique si el DNI ya existe.");
            console.error(error);
        }
    };

    const calcularEdadExacta = (fechaNac) => {
        if (!fechaNac) return 'N/A';
        const hoy = new Date();
        const cumple = new Date(fechaNac);
        if (isNaN(cumple.getTime())) return 'N/A';

        let anios = hoy.getFullYear() - cumple.getFullYear();
        let meses = hoy.getMonth() - cumple.getMonth();
        let dias = hoy.getDate() - cumple.getDate();

        if (dias < 0) {
            meses--;
        }
        if (meses < 0) {
            anios--;
            meses += 12;
        }

        if (anios < 0) return 'N/A';

        const textoAnios = anios === 1 ? '1 año' : `${anios} años`;
        const textoMeses = meses === 1 ? '1 mes' : `${meses} meses`;

        if (anios === 0) return textoMeses;
        return `${textoAnios}, ${textoMeses}`;
    };

    const pacientesFiltrados = pacientes.filter(p => {
        const termino = busqueda.toLowerCase().trim();
        if (!termino) return true;
        const nombreCompleto = `${p.nombre} ${p.apellido}`.toLowerCase();
        const doc = (p.documento || '').toLowerCase();
        return nombreCompleto.includes(termino) || doc.includes(termino);
    });

    return (
        <Container fluid className="p-0">
            <header className="page-header">
                <h1>Gestión de Pacientes</h1>
            </header>

            <section className="card border-0" aria-label="Gestión del padrón de pacientes">
                <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Listado de Pacientes</h2>
                    
                    <div className="d-flex gap-2 align-items-center" style={{ maxWidth: '400px', width: '100%' }}>
                        <InputGroup size="sm">
                            <Form.Control
                                placeholder="Buscar por DNI o Nombre..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                aria-label="Buscar pacientes por DNI o Nombre"
                            />
                            {busqueda && (
                                <Button variant="outline-secondary" onClick={() => setBusqueda('')}>
                                    ✕
                                </Button>
                            )}
                        </InputGroup>

                        <Button variant="primary" size="sm" onClick={() => setShowModal(true)} style={{ whiteSpace: 'nowrap' }} aria-label="Registrar nuevo paciente">
                            + Nuevo Paciente
                        </Button>
                    </div>
                </div>

                <div className="table-scroll">
                    <Table hover responsive className="align-middle mb-0" aria-label="Tabla de pacientes registrados">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">DNI / Documento</th>
                                <th scope="col">Nombre Completo</th>
                                <th scope="col">Fecha Nac. (Edad)</th>
                                <th scope="col">Teléfono</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pacientesFiltrados.map((p) => (
                                <tr key={p.idPaciente}>
                                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{p.idPaciente}</td>
                                    <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{p.documento}</td>
                                    <td style={{ fontWeight: 500 }}>{p.nombre} {p.apellido}</td>
                                    <td>
                                        <div>{calcularEdadExacta(p.fechaNac)}</div>
                                        <small className="text-muted">{p.fechaNac}</small>
                                    </td>
                                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{p.telefono}</td>
                                    <td>
                                        <div className="d-flex gap-1 flex-wrap">
                                            <Button variant="outline-info" size="sm" onClick={() => { setDniExpediente(p.documento); setShowExpedienteModal(true); }} aria-label={`Ver expediente 360 de ${p.nombre}`}>📋 Expediente</Button>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleEditar(p)} aria-label={`Editar a ${p.nombre} ${p.apellido}`}>Editar</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleConfirmarEliminar(p.idPaciente)} aria-label={`Eliminar a ${p.nombre} ${p.apellido}`}>Eliminar</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pacientesFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        {busqueda ? "No se encontraron pacientes que coincidan con la búsqueda." : "No hay pacientes registrados en el sistema."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </section>

            {/* MODAL DE REGISTRO / EDICIÓN */}
            <Modal show={showModal} onHide={handleCloseModal} centered aria-labelledby="modal-paciente-title">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-paciente-title">{modoEditar ? 'Editar Paciente' : 'Registrar Nuevo Paciente'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-3">
                            <Form.Label>DNI / Documento (8 dígitos)</Form.Label>
                            <Form.Control 
                                name="documento" 
                                required 
                                maxLength="8"
                                inputMode="numeric"
                                onChange={handleChange} 
                                value={formPaciente.documento} 
                                isInvalid={touched.documento && !!errors.documento}
                                readOnly={modoEditar}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.documento}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombres</Form.Label>
                            <Form.Control 
                                name="nombre" 
                                required 
                                onChange={handleChange} 
                                value={formPaciente.nombre} 
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
                                        value={formPaciente.apellidoPaterno} 
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
                                        value={formPaciente.apellidoMaterno} 
                                        isInvalid={touched.apellidoMaterno && !!errors.apellidoMaterno}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.apellidoMaterno}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha de Nacimiento</Form.Label>
                                    <Form.Control 
                                        name="fechaNac" 
                                        type="date"
                                        max={todayStr}
                                        required 
                                        onChange={handleChange} 
                                        value={formPaciente.fechaNac} 
                                        isInvalid={touched.fechaNac && !!errors.fechaNac}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.fechaNac}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Teléfono (9 dígitos)</Form.Label>
                                    <Form.Control 
                                        name="telefono" 
                                        required 
                                        maxLength="9"
                                        inputMode="numeric"
                                        onChange={handleChange} 
                                        value={formPaciente.telefono} 
                                        isInvalid={touched.telefono && !!errors.telefono}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.telefono}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                            <Button variant="primary" type="submit" disabled={!isFormPacienteValid()}>{modoEditar ? 'Actualizar' : 'Guardar'}</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered aria-labelledby="modal-eliminar-paciente-title">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-eliminar-paciente-title">Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro de que desea eliminar a este paciente? Esta acción no se puede deshacer.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={ejecutarEliminacion}>Eliminar</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL DE EXPEDIENTE 360° */}
            <ExpedienteModal 
                show={showExpedienteModal} 
                onHide={() => { setShowExpedienteModal(false); setDniExpediente(''); }} 
                dniPaciente={dniExpediente} 
            />
        </Container>
    );
};

export default GestionPacientes;
