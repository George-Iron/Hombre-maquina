import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const GestionLaboratorio = () => {
    const [analisis, setAnalisis] = useState([]);
    const [nombresPredefinidos, setNombresPredefinidos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '' });
    const [nombreOtro, setNombreOtro] = useState('');
    const [touched, setTouched] = useState({});

    // Estado para edición
    const [modoEditar, setModoEditar] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    // Estado para eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idEliminar, setIdEliminar] = useState(null);

    const isNombreOtroValido = form.nombre === 'Otros' 
        ? (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreOtro.trim()) && nombreOtro.trim().length > 5)
        : true;

    const precioNum = parseFloat(form.precio);
    const isPrecioValido = !isNaN(precioNum) && precioNum >= 0.10 && precioNum <= 999999.99;
    const isDescripcionValida = form.descripcion.trim().length >= 3;
    
    const isNombreValido = form.nombre === 'Otros' ? (isNombreOtroValido && nombreOtro.trim().length > 5) : Boolean(form.nombre);
    const isFormValido = isNombreValido && isDescripcionValida && isPrecioValido;

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
        const esPredefinido = nombresPredefinidos.includes(a.nombre);
        setForm({ 
            nombre: esPredefinido ? a.nombre : 'Otros', 
            descripcion: a.descripcion, 
            precio: a.precio 
        });
        setNombreOtro(esPredefinido ? '' : a.nombre);
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
        setNombreOtro('');
        setTouched({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValido) {
            toast.error("Complete todos los campos requeridos con datos válidos.");
            return;
        }
        const nombreFinal = form.nombre === 'Otros' ? nombreOtro.trim() : form.nombre;
        const payload = {
            nombre: nombreFinal,
            descripcion: form.descripcion.trim(),
            precio: parseFloat(form.precio)
        };
        try {
            if (modoEditar) {
                await api.put(`/laboratorio/actualizar/${idEditar}`, payload);
                toast.success("Análisis actualizado con éxito.");
            } else {
                await api.post('/laboratorio/registrar', payload);
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
                                    const val = e.target.value;
                                    setForm({...form, nombre: val});
                                    setTouched({...touched, nombre: true});
                                    if (val !== 'Otros') setNombreOtro('');
                                }}
                                isInvalid={touched.nombre && !form.nombre}
                            >
                                <option value="">Seleccione un análisis...</option>
                                {nombresPredefinidos.map((nom, index) => (
                                    <option key={index} value={nom}>{nom}</option>
                                ))}
                                <option value="Otros">Otros</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Debe seleccionar un tipo de análisis.
                            </Form.Control.Feedback>
                        </Form.Group>

                        {form.nombre === 'Otros' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Especificar Nombre del Análisis</Form.Label>
                                <Form.Control 
                                    type="text"
                                    required
                                    maxLength="100"
                                    placeholder="Ej: Hemograma Completo y Perfil Lipídico"
                                    value={nombreOtro}
                                    onChange={e => {
                                        const soloLetras = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                                        setNombreOtro(soloLetras);
                                        setTouched({...touched, nombreOtro: true});
                                    }}
                                    isInvalid={touched.nombreOtro && !isNombreOtroValido}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreOtro.trim())
                                        ? "El nombre solo debe contener letras (sin números ni símbolos)."
                                        : "El nombre del análisis debe tener más de 5 letras."}
                                </Form.Control.Feedback>
                            </Form.Group>
                        )}

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
                                max="999999.99"
                                required 
                                value={form.precio}
                                onChange={e => {
                                    const val = e.target.value;
                                    const parteEntera = val.split('.')[0] || '';
                                    if (val === '' || (parseFloat(val) <= 999999.99 && parteEntera.length <= 6)) {
                                        setForm({...form, precio: val});
                                        setTouched({...touched, precio: true});
                                    }
                                }} 
                                isInvalid={touched.precio && !isPrecioValido}
                            />
                            <Form.Control.Feedback type="invalid">
                                El precio debe estar entre S/ 0.10 y S/ 999,999.99 (máximo 6 cifras).
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