import { useState, useEffect, useContext } from 'react';
import api from '../../config/axios';
import { AuthContext } from '../../context/AuthProvider';
import { Container, Table, Button, Card, Form, Badge, Row, Col, Modal, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import LaboratorioPrintModal from '../../components/LaboratorioPrintModal';
import ExpedienteModal from '../../components/ExpedienteModal';
import { logAuditAction } from '../../utils/auditLogger';

const ResultadosLaboratorio = () => {
    const { user } = useContext(AuthContext);

    const [ordenes, setOrdenes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('TODOS');

    // Modal Registrar Resultado
    const [showRegistroModal, setShowRegistroModal] = useState(false);
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
    const [resultadoTexto, setResultadoTexto] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [estadoResultado, setEstadoResultado] = useState('NORMAL');

    // Modal Imprimir PDF
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [printData, setPrintData] = useState(null);

    // Modal Expediente 360
    const [showExpedienteModal, setShowExpedienteModal] = useState(false);
    const [dniExpediente, setDniExpediente] = useState('');

    useEffect(() => {
        cargarOrdenes();
    }, []);

    const cargarOrdenes = async () => {
        try {
            const [resAnalisis, resPacientes] = await Promise.all([
                api.get('/laboratorio/listar').catch(() => ({ data: [] })),
                api.get('/paciente/listar').catch(() => ({ data: [] }))
            ]);

            const tipos = resAnalisis.data || [];
            const pacientes = resPacientes.data || [];

            // Generar lista demostrativa de órdenes de laboratorio
            const ordenesDemo = [
                {
                    idOrden: '101',
                    paciente: pacientes[0] || { nombre: 'Juan', apellido: 'Pérez', documento: '72819234', telefono: '987654321' },
                    nombreAnalisis: tipos[0]?.nombre || 'Hemograma Completo',
                    indicaciones: 'En ayunas por 8 horas',
                    estado: 'COMPLETADO',
                    resultado: 'Hemoglobina: 14.2 g/dL (Normal)\nLeucocitos: 7,200 /uL (Normal)\nPlaquetas: 240,000 /uL (Normal)',
                    observaciones: 'Muestra sanguínea en excelente estado. Valores hemáticos dentro del rango fisiológico normal.',
                    estadoResultado: 'NORMAL',
                    fecha: new Date().toLocaleDateString('es-PE')
                },
                {
                    idOrden: '102',
                    paciente: pacientes[1] || { nombre: 'María', apellido: 'Gómez', documento: '45912384', telefono: '912345678' },
                    nombreAnalisis: tipos[1]?.nombre || 'Perfil Lipídico',
                    indicaciones: 'Ayuno estricto de 12 horas',
                    estado: 'PENDIENTE',
                    resultado: '',
                    observaciones: '',
                    estadoResultado: 'NORMAL',
                    fecha: new Date().toLocaleDateString('es-PE')
                },
                {
                    idOrden: '103',
                    paciente: pacientes[2] || { nombre: 'Carlos', apellido: 'López', documento: '10293847', telefono: '933445566' },
                    nombreAnalisis: tipos[2]?.nombre || 'Examen de Orina Completo',
                    indicaciones: 'Primera orina de la mañana',
                    estado: 'COMPLETADO',
                    resultado: 'Color: Amarillo pálido\nAspecto: Límpido\nDensidad: 1.015\npH: 6.0\nProteínas: Negativo\nGlucosa: Negativo',
                    observaciones: 'Sin presencia de sedimento patológico ni bacteriuria.',
                    estadoResultado: 'NORMAL',
                    fecha: new Date().toLocaleDateString('es-PE')
                }
            ];

            setOrdenes(ordenesDemo);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar órdenes de laboratorio.");
        }
    };

    const handleOpenRegistrar = (ord) => {
        setOrdenSeleccionada(ord);
        setResultadoTexto(ord.resultado || '');
        setObservaciones(ord.observaciones || '');
        setEstadoResultado(ord.estadoResultado || 'NORMAL');
        setShowRegistroModal(true);
    };

    const guardarResultado = () => {
        if (!resultadoTexto.trim()) {
            toast.error("Ingrese el resultado del análisis.");
            return;
        }

        setOrdenes(prev => prev.map(o => 
            o.idOrden === ordenSeleccionada.idOrden ? {
                ...o,
                resultado: resultadoTexto.trim(),
                observaciones: observaciones.trim(),
                estadoResultado,
                estado: 'COMPLETADO'
            } : o
        ));

        logAuditAction({
            usuario: user?.nombre || 'Laboratorio',
            rol: 'ADMIN',
            accion: 'REGISTRO',
            modulo: 'Laboratorio',
            detalle: `Ingresó resultado de laboratorio para ${ordenSeleccionada.nombreAnalisis} del paciente ${ordenSeleccionada.paciente.nombre}`
        });

        toast.success(`Resultado registrado con éxito para ${ordenSeleccionada.nombreAnalisis}.`);
        setShowRegistroModal(false);
    };

    const handleOpenPrint = (ord) => {
        setPrintData({
            idOrden: ord.idOrden,
            paciente: ord.paciente,
            nombreAnalisis: ord.nombreAnalisis,
            resultado: ord.resultado || 'Pendiente de emisión.',
            observaciones: ord.observaciones || 'En proceso.',
            estadoResultado: ord.estadoResultado || 'NORMAL',
            laboratoristaNombre: user?.nombre || 'Lic. Tecnología Médica'
        });
        setShowPrintModal(true);
    };

    const pendientesCount = ordenes.filter(o => o.estado === 'PENDIENTE').length;
    const completadosCount = ordenes.filter(o => o.estado === 'COMPLETADO').length;

    const ordenesFiltradas = ordenes.filter(o => {
        const termino = busqueda.toLowerCase().trim();
        const matchText = (o.paciente.nombre || '').toLowerCase().includes(termino) || (o.paciente.documento || '').toLowerCase().includes(termino) || (o.nombreAnalisis || '').toLowerCase().includes(termino);
        const matchEstado = filtroEstado === 'TODOS' || o.estado === filtroEstado;
        return matchText && matchEstado;
    });

    return (
        <Container fluid className="p-0">
            <div className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                    <h2>Bandeja de Laboratorio Clínico</h2>
                    <p>Ingreso de resultados de análisis, validación biomédica y emisión de informes PDF.</p>
                </div>
                <Button variant="outline-primary" size="sm" onClick={cargarOrdenes}>
                    🔄 Actualizar Bandeja
                </Button>
            </div>

            {/* TARJETAS KPI DE ÓRDENES */}
            <Row className="g-3 mb-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm" style={{ borderLeft: '4px solid var(--semantic-warning)' }}>
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <small className="text-muted d-block fw-semibold text-uppercase">Análisis Pendientes</small>
                                <span className="fs-3 fw-bold text-warning">{pendientesCount}</span>
                            </div>
                            <div className="fs-1">⌛</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm" style={{ borderLeft: '4px solid var(--semantic-success)' }}>
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <small className="text-muted d-block fw-semibold text-uppercase">Resultados Listos</small>
                                <span className="fs-3 fw-bold text-success">{completadosCount}</span>
                            </div>
                            <div className="fs-1">✅</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm" style={{ borderLeft: '4px solid var(--accent)' }}>
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <small className="text-muted d-block fw-semibold text-uppercase">Total Pruebas Solicitadas</small>
                                <span className="fs-3 fw-bold text-primary">{ordenes.length}</span>
                            </div>
                            <div className="fs-1">🧪</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* CONTENEDOR TABLA */}
            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h4 style={{ margin: 0 }}>Órdenes de Análisis Registradas</h4>

                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        <Form.Select 
                            size="sm" 
                            value={filtroEstado} 
                            onChange={e => setFiltroEstado(e.target.value)}
                            style={{ width: '160px' }}
                        >
                            <option value="TODOS">Todos los Estados</option>
                            <option value="PENDIENTE">⌛ Pendientes</option>
                            <option value="COMPLETADO">✅ Completados</option>
                        </Form.Select>

                        <InputGroup size="sm" style={{ maxWidth: '250px' }}>
                            <Form.Control 
                                placeholder="Buscar Paciente, DNI o Prueba..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                            />
                            {busqueda && (
                                <Button variant="outline-secondary" onClick={() => setBusqueda('')}>✕</Button>
                            )}
                        </InputGroup>
                    </div>
                </div>

                <div className="table-scroll">
                    <Table hover responsive className="align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Orden #</th>
                                <th>Paciente</th>
                                <th>Análisis Solicitado</th>
                                <th>Indicaciones</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenesFiltradas.map(ord => (
                                <tr key={ord.idOrden}>
                                    <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>L-{ord.idOrden}</td>
                                    <td>
                                        <div className="fw-semibold">{ord.paciente.nombre} {ord.paciente.apellido}</div>
                                        <small className="text-muted">DNI: {ord.paciente.documento}</small>
                                    </td>
                                    <td className="fw-bold text-primary">{ord.nombreAnalisis}</td>
                                    <td className="small text-muted">{ord.indicaciones}</td>
                                    <td>
                                        {ord.estado === 'COMPLETADO' ? (
                                            <Badge bg="success">✅ COMPLETADO</Badge>
                                        ) : (
                                            <Badge bg="warning" text="dark">⌛ PENDIENTE</Badge>
                                        )}
                                    </td>
                                    <td>
                                        <div className="d-flex gap-1 flex-wrap">
                                            <Button variant="outline-success" size="sm" onClick={() => handleOpenRegistrar(ord)}>
                                                🧪 {ord.estado === 'COMPLETADO' ? 'Editar Resultado' : 'Ingresar Resultado'}
                                            </Button>
                                            {ord.estado === 'COMPLETADO' && (
                                                <Button variant="outline-warning" size="sm" className="text-dark" onClick={() => handleOpenPrint(ord)}>
                                                    🖨️ Informe PDF
                                                </Button>
                                            )}
                                            {ord.paciente.documento && (
                                                <Button variant="outline-info" size="sm" onClick={() => { setDniExpediente(ord.paciente.documento); setShowExpedienteModal(true); }}>
                                                    📋 Expediente
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {ordenesFiltradas.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        No se encontraron órdenes de laboratorio con los filtros aplicados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* MODAL REGISTRAR RESULTADO */}
            <Modal show={showRegistroModal} onHide={() => setShowRegistroModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>🧪 Registrar Resultado de Laboratorio - Orden L-{ordenSeleccionada?.idOrden}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-1"><strong>Paciente:</strong> {ordenSeleccionada?.paciente.nombre} {ordenSeleccionada?.paciente.apellido} (DNI: {ordenSeleccionada?.paciente.documento})</p>
                    <p className="mb-3"><strong>Prueba Solicitada:</strong> <span className="text-primary fw-bold">{ordenSeleccionada?.nombreAnalisis}</span></p>

                    <Form.Group className="mb-3">
                        <Form.Label>Valores Medidos / Resultado Analítico:</Form.Label>
                        <Form.Control 
                            as="textarea"
                            rows={4}
                            placeholder="Ej: Hemoglobina: 14.5 g/dL, Leucocitos: 7,500 /uL..."
                            value={resultadoTexto}
                            onChange={e => setResultadoTexto(e.target.value)}
                        />
                    </Form.Group>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Estado del Resultado:</Form.Label>
                                <Form.Select value={estadoResultado} onChange={e => setEstadoResultado(e.target.value)}>
                                    <option value="NORMAL">🟢 Normal (Dentro de rango)</option>
                                    <option value="ALTERADO">🔴 Alterado (Fuera de rango)</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Observaciones / Conclusión del Laboratorista:</Form.Label>
                        <Form.Control 
                            as="textarea"
                            rows={2}
                            placeholder="Ej: Muestra sin hemólisis. Resultados verificados por duplicado."
                            value={observaciones}
                            onChange={e => setObservaciones(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRegistroModal(false)}>Cancelar</Button>
                    <Button variant="success" onClick={guardarResultado}>💾 Guardar y Validar Resultado</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL IMPRIMIR INFORME PDF */}
            <LaboratorioPrintModal 
                show={showPrintModal} 
                onHide={() => setShowPrintModal(false)} 
                laboratorioData={printData} 
            />

            {/* MODAL EXPEDIENTE 360 */}
            <ExpedienteModal 
                show={showExpedienteModal} 
                onHide={() => { setShowExpedienteModal(false); setDniExpediente(''); }} 
                dniPaciente={dniExpediente} 
            />

        </Container>
    );
};

export default ResultadosLaboratorio;
