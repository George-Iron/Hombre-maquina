import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const GestionLaboratorio = () => {
    const [analisis, setAnalisis] = useState([]);
    const [nombresPredefinidos, setNombresPredefinidos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '' });
    const [touched, setTouched] = useState({});

    // Estado para edición
    const [modoEditar, setModoEditar] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    // Estado para eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idEliminar, setIdEliminar] = useState(null);

    const precioNum = parseFloat(form.precio);
    const isPrecioValido = !isNaN(precioNum) && precioNum > 0;
    const isDescripcionValida = form.descripcion.trim().length >= 3;
    const isFormValido = form.nombre && isDescripcionValida && isPrecioValido;

    const cargar = async () => {
        try {
            const [resAnalisis, resNombres] = await Promise.all([
                api.get('/laboratorio/listar'),
                api.get('/laboratorio/nombres-predefinidos')
            ]);
            setAnalisis(resAnalisis.data);
            setNombresPredefinidos(resNombres.data);
        } catch (e) {
            console.error(e);
            try {
                const resAnalisis = await api.get('/laboratorio/listar');
                setAnalisis(resAnalisis.data);
            } catch (err) { console.error(err); }
        }
    };

    useEffect(() => { cargar(); }, []);

    const handleEditar = (a) => {
        setForm({ nombre: a.nombre, descripcion: a.descripcion, precio: a.precio });
        setModoEditar(true);
        setIdEditar(a.idTipoAnalisis);
        setShowModal(true);
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
            await api.delete(`/laboratorio/eliminar/${idEliminar}`);
            toast.success("Análisis eliminado con éxito.");
            setIdEliminar(null);
            cargar();
        } catch (e) {
            toast.error("Error al eliminar análisis.");
            console.error(e);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModoEditar(false);
        setIdEditar(null);
        setForm({ nombre: '', descripcion: '', precio: '' });
        setTouched({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValido) {
            toast.error("Complete todos los campos requeridos con datos válidos.");
            return;
        }
        try {
            if (modoEditar) {
                await api.put(`/laboratorio/actualizar/${idEditar}`, {
                    ...form,
                    descripcion: form.descripcion.trim()
                });
                toast.success("Análisis actualizado con éxito.");
            } else {
                await api.post('/laboratorio/registrar', {
                    ...form,
                    descripcion: form.descripcion.trim()
                });
                toast.success("Análisis registrado con éxito.");
            }
            handleCloseModal();
            cargar();
        } catch (e) { 
            toast.error(modoEditar ? "Error al actualizar análisis." : "Error al guardar análisis."); 
            console.error(e);
        }
    };

    return (
        <Container fluid className="p-0">
            <div className="page-header">
                <h2>Gestión de Laboratorio</h2>
            </div>

            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>Listado de Análisis</h4>
                    <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                        + Nuevo Análisis
                    </Button>
                </div>

                <div className="table-scroll">
                    <Table hover responsive className="align-middle mb-0">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analisis.map(a => (
                                <tr key={a.idTipoAnalisis}>
                                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{a.idTipoAnalisis}</td>
                                    <td style={{ fontWeight: 500 }}>{a.nombre}</td>
                                    <td>{a.descripcion}</td>
                                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>S/ {a.precio}</td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <Button variant="outline-primary" size="sm" onClick={() => handleEditar(a)} aria-label={`Editar ${a.nombre}`}>Editar</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleConfirmarEliminar(a.idTipoAnalisis)} aria-label={`Eliminar ${a.nombre}`}>Eliminar</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {analisis.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">
                                        No hay análisis registrados en el sistema
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* MODAL DE REGISTRO / EDICIÓN */}
            <Modal show={showModal} onHide={handleCloseModal} centered aria-labelledby="modal-laboratorio-title">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-laboratorio-title">{modoEditar ? 'Editar Tipo de Análisis' : 'Nuevo Tipo de Análisis'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Select 
                                required 
                                value={form.nombre}
                                onChange={e => {
                                    setForm({...form, nombre: e.target.value});
                                    setTouched({...touched, nombre: true});
                                }}
                                isInvalid={touched.nombre && !form.nombre}
                            >
                                <option value="">Seleccione un análisis...</option>
                                {nombresPredefinidos.map((nom, index) => (
                                    <option key={index} value={nom}>{nom}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Debe seleccionar un tipo de análisis.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control 
                                required 
                                as="textarea" 
                                rows={2}
                                value={form.descripcion}
                                onChange={e => {
                                    setForm({...form, descripcion: e.target.value});
                                    setTouched({...touched, descripcion: true});
                                }} 
                                isInvalid={touched.descripcion && !isDescripcionValida}
                            />
                            <Form.Control.Feedback type="invalid">
                                La descripción debe tener al menos 3 caracteres.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio (S/)</Form.Label>
                            <Form.Control 
                                type="number" 
                                step="0.10" 
                                min="0.10"
                                required 
                                value={form.precio}
                                onChange={e => {
                                    setForm({...form, precio: e.target.value});
                                    setTouched({...touched, precio: true});
                                }} 
                                isInvalid={touched.precio && !isPrecioValido}
                            />
                            <Form.Control.Feedback type="invalid">
                                El precio debe ser un número mayor a 0.
                            </Form.Control.Feedback>
                        </Form.Group>
                        
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary" disabled={!isFormValido}>
                                {modoEditar ? 'Actualizar' : 'Guardar'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered aria-labelledby="modal-eliminar-lab-title">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-eliminar-lab-title">Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro de que desea eliminar este análisis? Esta acción no se puede deshacer.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={ejecutarEliminacion}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default GestionLaboratorio;