import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const GestionFarmacia = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [laboratorios, setLaboratorios] = useState([]);
    const [nombresPredefinidos, setNombresPredefinidos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ nombre: '', laboratorio: '', precio: '' });
    const [touched, setTouched] = useState({});

    // Estado para edición
    const [modoEditar, setModoEditar] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    // Estado para eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idEliminar, setIdEliminar] = useState(null);

    const precioNum = parseFloat(form.precio);
    const isPrecioValido = !isNaN(precioNum) && precioNum > 0;
    const isFormValido = form.nombre && form.laboratorio && isPrecioValido;

    const cargar = async () => {
        try {
            const [resMeds, resLabs, resNombres] = await Promise.all([
                api.get('/farmacia/listar'),
                api.get('/farmacia/laboratorios'),
                api.get('/farmacia/nombres-predefinidos')
            ]);
            setMedicamentos(resMeds.data);
            setLaboratorios(resLabs.data);
            setNombresPredefinidos(resNombres.data);
        } catch (e) {
            console.error(e);
            try {
                const resMeds = await api.get('/farmacia/listar');
                setMedicamentos(resMeds.data);
            } catch (err) { console.error(err); }
        }
    };

    useEffect(() => { cargar(); }, []);

    const handleEditar = (m) => {
        setForm({ nombre: m.nombre, laboratorio: m.laboratorio, precio: m.precio });
        setModoEditar(true);
        setIdEditar(m.idMedicamento);
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
            await api.delete(`/farmacia/eliminar/${idEliminar}`);
            toast.success("Medicamento eliminado con éxito.");
            setIdEliminar(null);
            cargar();
        } catch (e) {
            toast.error("Error al eliminar medicamento.");
            console.error(e);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModoEditar(false);
        setIdEditar(null);
        setForm({ nombre: '', laboratorio: '', precio: '' });
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
                await api.put(`/farmacia/actualizar/${idEditar}`, form);
                toast.success("Medicamento actualizado con éxito.");
            } else {
                await api.post('/farmacia/registrar', form);
                toast.success("Medicamento registrado con éxito.");
            }
            handleCloseModal();
            cargar();
        } catch (e) { 
            toast.error(modoEditar ? "Error al actualizar medicamento." : "Error al guardar medicamento."); 
            console.error(e);
        }
    };

    return (
        <Container fluid className="p-0">
            <div className="page-header">
                <h2>Gestión de Farmacia</h2>
            </div>

            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>Inventario de Medicamentos</h4>
                    <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                        + Nuevo Medicamento
                    </Button>
                </div>

                <div className="table-scroll">
                    <Table hover responsive className="align-middle mb-0">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Laboratorio</th>
                                <th>Precio Unitario</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicamentos.map(m => (
                                <tr key={m.idMedicamento}>
                                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{m.idMedicamento}</td>
                                    <td style={{ fontWeight: 500 }}>{m.nombre}</td>
                                    <td>{m.laboratorio}</td>
                                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>S/ {m.precio}</td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <Button variant="outline-primary" size="sm" onClick={() => handleEditar(m)} aria-label={`Editar ${m.nombre}`}>Editar</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleConfirmarEliminar(m.idMedicamento)} aria-label={`Eliminar ${m.nombre}`}>Eliminar</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {medicamentos.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">
                                        No hay medicamentos registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* MODAL DE REGISTRO / EDICIÓN */}
            <Modal show={showModal} onHide={handleCloseModal} centered aria-labelledby="modal-farmacia-title">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-farmacia-title">{modoEditar ? 'Editar Medicamento' : 'Nuevo Medicamento'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre Comercial</Form.Label>
                            <Form.Select 
                                required 
                                value={form.nombre}
                                onChange={e => {
                                    setForm({...form, nombre: e.target.value});
                                    setTouched({...touched, nombre: true});
                                }}
                                isInvalid={touched.nombre && !form.nombre}
                            >
                                <option value="">Seleccione un medicamento...</option>
                                {nombresPredefinidos.map((nom, index) => (
                                    <option key={index} value={nom}>{nom}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Debe seleccionar un medicamento.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Laboratorio</Form.Label>
                            <Form.Select 
                                required 
                                value={form.laboratorio}
                                onChange={e => {
                                    setForm({...form, laboratorio: e.target.value});
                                    setTouched({...touched, laboratorio: true});
                                }}
                                isInvalid={touched.laboratorio && !form.laboratorio}
                            >
                                <option value="">Seleccione un laboratorio...</option>
                                {laboratorios.map((lab, index) => (
                                    <option key={index} value={lab}>{lab}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Debe seleccionar un laboratorio.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio Unitario (S/)</Form.Label>
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
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered aria-labelledby="modal-eliminar-farmacia-title">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-eliminar-farmacia-title">Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro de que desea eliminar este medicamento? Esta acción no se puede deshacer.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={ejecutarEliminacion}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default GestionFarmacia;