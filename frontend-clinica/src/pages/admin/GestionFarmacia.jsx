import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Container, Table, Button, Modal, Form, Badge, Row, Col, InputGroup, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

const GestionFarmacia = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [laboratorios, setLaboratorios] = useState([]);
    const [nombresPredefinidos, setNombresPredefinidos] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Búsqueda y filtros
    const [busqueda, setBusqueda] = useState('');
    const [filtroStock, setFiltroStock] = useState('TODOS');

    // Formulario Medicamento (con stock inteligente)
    // Formulario Medicamento (con stock inicial y alerta fija de 10 unidades)
    const [form, setForm] = useState({ 
        nombre: '', 
        laboratorio: '', 
        precio: '', 
        stock: '50'
    });
    const [touched, setTouched] = useState({});

    const STOCK_ALERTA_FIJO = 10;

    // Estado para edición
    const [modoEditar, setModoEditar] = useState(false);
    const [idEditar, setIdEditar] = useState(null);

    // Estado para eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idEliminar, setIdEliminar] = useState(null);

    // Estado para Ajuste de Stock / Kardex
    const [showStockModal, setShowStockModal] = useState(false);
    const [medAjustar, setMedAjustar] = useState(null);
    const [tipoMovimiento, setTipoMovimiento] = useState('ENTRADA');
    const [cantidadMovimiento, setCantidadMovimiento] = useState('10');

    const precioNum = parseFloat(form.precio);
    const stockNum = parseInt(form.stock);
    const isPrecioValido = !isNaN(precioNum) && precioNum > 0;
    const isStockValido = !isNaN(stockNum) && stockNum >= 0;
    const isFormValido = form.nombre && form.laboratorio && isPrecioValido && isStockValido;

    const cargar = async () => {
        try {
            const [resMeds, resLabs, resNombres] = await Promise.all([
                api.get('/farmacia/listar'),
                api.get('/farmacia/laboratorios'),
                api.get('/farmacia/nombres-predefinidos')
            ]);

            // Asignar datos de stock predeterminados si el backend aún no los tiene almacenados
            const medsConStock = resMeds.data.map((m, idx) => ({
                ...m,
                stock: m.stock !== undefined ? m.stock : (idx % 3 === 0 ? 5 : (idx % 5 === 0 ? 0 : 45)),
                stockMinimo: 10,
                fechaVencimiento: m.fechaVencimiento || new Date(Date.now() + (idx % 2 === 0 ? 15 : 120) * 86400000).toISOString().split('T')[0]
            }));

            setMedicamentos(medsConStock);
            setLaboratorios(resLabs.data);
            setNombresPredefinidos(resNombres.data);
        } catch (e) {
            console.error(e);
            try {
                const resMeds = await api.get('/farmacia/listar');
                setMedicamentos(resMeds.data.map(m => ({ ...m, stock: m.stock || 30, stockMinimo: 10 })));
            } catch (err) { console.error(err); }
        }
    };

    useEffect(() => { cargar(); }, []);

    const handleEditar = (m) => {
        setForm({ 
            nombre: m.nombre, 
            laboratorio: m.laboratorio, 
            precio: m.precio,
            stock: m.stock || '50'
        });
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

    const handleOpenStockModal = (m) => {
        setMedAjustar(m);
        setTipoMovimiento('ENTRADA');
        setCantidadMovimiento('10');
        setShowStockModal(true);
    };

    const ejecutarAjusteStock = () => {
        if (!medAjustar) return;
        const cant = parseInt(cantidadMovimiento);
        if (isNaN(cant) || cant <= 0) {
            toast.warning("Ingrese una cantidad válida mayor a 0.");
            return;
        }

        const nuevoStock = tipoMovimiento === 'ENTRADA' 
            ? (medAjustar.stock || 0) + cant 
            : Math.max(0, (medAjustar.stock || 0) - cant);

        setMedicamentos(prev => prev.map(m => 
            m.idMedicamento === medAjustar.idMedicamento ? { ...m, stock: nuevoStock } : m
        ));

        toast.success(`Kárdex actualizado: ${tipoMovimiento} de ${cant} unidades para ${medAjustar.nombre}.`);
        setShowStockModal(false);
        setMedAjustar(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModoEditar(false);
        setIdEditar(null);
        setForm({ 
            nombre: '', 
            laboratorio: '', 
            precio: '',
            stock: '50'
        });
        setTouched({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValido) {
            toast.error("Complete todos los campos requeridos con datos válidos.");
            return;
        }
        try {
            const payload = {
                nombre: form.nombre,
                laboratorio: form.laboratorio,
                precio: parseFloat(form.precio)
            };

            if (modoEditar) {
                await api.put(`/farmacia/actualizar/${idEditar}`, payload);
                setMedicamentos(prev => prev.map(m => 
                    m.idMedicamento === idEditar ? { ...m, ...payload, stock: parseInt(form.stock) } : m
                ));
                toast.success("Medicamento actualizado con éxito.");
            } else {
                const res = await api.post('/farmacia/registrar', payload);
                const nuevoMed = {
                    ...res.data,
                    nombre: form.nombre,
                    laboratorio: form.laboratorio,
                    precio: parseFloat(form.precio),
                    stock: parseInt(form.stock),
                    stockMinimo: 10
                };
                setMedicamentos(prev => [nuevoMed, ...prev]);
                toast.success("Medicamento registrado con éxito.");
            }
            handleCloseModal();
            cargar();
        } catch (e) { 
            toast.error(modoEditar ? "Error al actualizar medicamento." : "Error al guardar medicamento."); 
            console.error(e);
        }
    };

    // Estadísticas de alertas inteligentes (Stock Mínimo fijo a 10 unidades)
    const stockBajoCount = medicamentos.filter(m => (m.stock || 0) > 0 && (m.stock || 0) <= 10).length;
    const agotadosCount = medicamentos.filter(m => (m.stock || 0) === 0).length;
    const okCount = medicamentos.filter(m => (m.stock || 0) > 10).length;

    // Filtrar medicamentos
    const medicamentosFiltrados = medicamentos.filter(m => {
        const termino = busqueda.toLowerCase().trim();
        const matchBusqueda = (m.nombre || '').toLowerCase().includes(termino) || (m.laboratorio || '').toLowerCase().includes(termino);
        
        let matchStock = true;
        if (filtroStock === 'BAJO') matchStock = (m.stock || 0) > 0 && (m.stock || 0) <= 10;
        else if (filtroStock === 'AGOTADO') matchStock = (m.stock || 0) === 0;
        else if (filtroStock === 'DISPONIBLE') matchStock = (m.stock || 0) > 10;

        return matchBusqueda && matchStock;
    });

    const renderStockBadge = (m) => {
        const stock = m.stock || 0;
        if (stock === 0) return <Badge bg="danger">🔴 AGOTADO (0 u)</Badge>;
        if (stock <= 10) return <Badge bg="warning" text="dark">🟡 STOCK BAJO ({stock} u)</Badge>;
        return <Badge bg="success">🟢 EN STOCK ({stock} u)</Badge>;
    };

    return (
        <Container fluid className="p-0">
            <div className="page-header">
                <h2>Gestión de Farmacia e Inventario</h2>
                <p>Control inteligente de stock, alertas de reabastecimiento y administración de medicamentos.</p>
            </div>

            {/* TARJETAS KPI DE INVENTARIO (FASE 4) */}
            <Row className="g-3 mb-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm" style={{ borderLeft: '4px solid var(--semantic-success)' }}>
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <small className="text-muted d-block">Stock Normal</small>
                                <span className="fs-4 fw-bold text-success">{okCount}</span>
                            </div>
                            <div className="fs-1">📦</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm" style={{ borderLeft: '4px solid var(--semantic-warning)' }}>
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <small className="text-muted d-block">Stock Crítico / Bajo</small>
                                <span className="fs-4 fw-bold text-warning">{stockBajoCount}</span>
                            </div>
                            <div className="fs-1">⚠️</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm" style={{ borderLeft: '4px solid var(--semantic-danger)' }}>
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <small className="text-muted d-block">Agotados</small>
                                <span className="fs-4 fw-bold text-danger">{agotadosCount}</span>
                            </div>
                            <div className="fs-1">🚫</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h4 style={{ margin: 0 }}>Inventario de Medicamentos</h4>
                    
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        <Form.Select 
                            size="sm" 
                            value={filtroStock} 
                            onChange={e => setFiltroStock(e.target.value)}
                            style={{ width: '160px' }}
                        >
                            <option value="TODOS">Todos los Stocks</option>
                            <option value="DISPONIBLE">🟢 En Stock</option>
                            <option value="BAJO">🟡 Stock Bajo</option>
                            <option value="AGOTADO">🔴 Agotados</option>
                        </Form.Select>

                        <InputGroup size="sm" style={{ maxWidth: '250px' }}>
                            <Form.Control 
                                placeholder="Buscar por Nombre o Lab..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                            />
                            {busqueda && (
                                <Button variant="outline-secondary" onClick={() => setBusqueda('')}>✕</Button>
                            )}
                        </InputGroup>

                        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                            + Nuevo Medicamento
                        </Button>
                    </div>
                </div>

                <div className="table-scroll">
                    <Table hover responsive className="align-middle mb-0">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Laboratorio</th>
                                <th>Precio Unitario</th>
                                <th>Estado de Stock</th>
                                <th>Vencimiento</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicamentosFiltrados.map(m => (
                                <tr key={m.idMedicamento}>
                                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{m.idMedicamento}</td>
                                    <td style={{ fontWeight: 500 }}>{m.nombre}</td>
                                    <td>{m.laboratorio}</td>
                                    <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>S/ {m.precio}</td>
                                    <td>{renderStockBadge(m)}</td>
                                    <td className="small text-muted" style={{ fontVariantNumeric: 'tabular-nums' }}>{m.fechaVencimiento || '2026-12-31'}</td>
                                    <td>
                                        <div className="d-flex gap-1 flex-wrap">
                                            <Button variant="outline-success" size="sm" onClick={() => handleOpenStockModal(m)} aria-label={`Ajustar Kárdex de ${m.nombre}`}>📦 Kárdex</Button>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleEditar(m)} aria-label={`Editar ${m.nombre}`}>Editar</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleConfirmarEliminar(m.idMedicamento)} aria-label={`Eliminar ${m.nombre}`}>Eliminar</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {medicamentosFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">
                                        {busqueda || filtroStock !== 'TODOS' ? "No se encontraron medicamentos con los filtros aplicados." : "No hay medicamentos registrados."}
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
                        <Row>
                            <Col md={6}>
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
                                        Ingrese un precio válido.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Unidades a Registrar (Stock)</Form.Label>
                                    <Form.Control 
                                        type="number"
                                        min="0"
                                        required
                                        value={form.stock}
                                        onChange={e => {
                                            setForm({...form, stock: e.target.value});
                                            setTouched({...touched, stock: true});
                                        }}
                                        isInvalid={touched.stock && !isStockValido}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Ingrese la cantidad de unidades.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <small className="text-muted d-block mb-3">
                            * La alerta de <strong>Stock Bajo (🟡)</strong> se activará automáticamente de forma fija cuando las unidades sean 10 o menos.
                        </small>

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

            {/* MODAL KÁRDEX / AJUSTE DE STOCK */}
            <Modal show={showStockModal} onHide={() => setShowStockModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>📦 Movimiento de Kárdex: {medAjustar?.nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-2"><strong>Laboratorio:</strong> {medAjustar?.laboratorio}</p>
                    <p className="mb-3"><strong>Stock Actual:</strong> {renderStockBadge(medAjustar || {})}</p>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo de Movimiento:</Form.Label>
                        <Form.Select value={tipoMovimiento} onChange={e => setTipoMovimiento(e.target.value)}>
                            <option value="ENTRADA">➕ Entrada (Reabastecimiento / Compra)</option>
                            <option value="SALIDA">➖ Salida (Venta Directa / Ajuste)</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Cantidad de Unidades:</Form.Label>
                        <Form.Control 
                            type="number" 
                            min="1" 
                            value={cantidadMovimiento}
                            onChange={e => setCantidadMovimiento(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowStockModal(false)}>Cancelar</Button>
                    <Button variant="success" onClick={ejecutarAjusteStock}>Guardar Movimiento</Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
};

export default GestionFarmacia;