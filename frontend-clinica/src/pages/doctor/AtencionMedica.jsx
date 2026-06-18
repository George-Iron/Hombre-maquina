import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Accordion, Spinner, Table } from 'react-bootstrap';
import { FaHistory, FaUserInjured, FaFilePrescription, FaVials } from 'react-icons/fa';
import { toast } from 'react-toastify';

const calcularEdad = (fecha) => {
    if (!fecha) return 'N/A';
    const anio = new Date(fecha).getFullYear();
    if (isNaN(anio)) return 'N/A';
    return new Date().getFullYear() - anio;
};

const AtencionMedica = () => {
    const { idCita } = useParams();
    const navigate = useNavigate();

    // --- ESTADOS ---
    const [loading, setLoading] = useState(true);
    const [paciente, setPaciente] = useState(null);
    const [historia, setHistoria] = useState(null); // Peso, talla
    const [historialAtenciones, setHistorialAtenciones] = useState([]); // consultas pasadas

    // Catálogos
    const [medicamentos, setMedicamentos] = useState([]);
    const [analisis, setAnalisis] = useState([]);

    // Formulario Actual
    const [diagnostico, setDiagnostico] = useState('');
    const [tratamiento, setTratamiento] = useState('');
    const [observaciones, setObservaciones] = useState('');

    // Receta Dinámica
    const [recetaItems, setRecetaItems] = useState([]);
    const [medSeleccionado, setMedSeleccionado] = useState('');
    const [dosis, setDosis] = useState('');

    // Análisis Dinámico
    const [analisisItems, setAnalisisItems] = useState([]);
    const [anaSeleccionado, setAnaSeleccionado] = useState('');
    const [indicaciones, setIndicaciones] = useState('');

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [medsRes, labsRes] = await Promise.all([
                    api.get('/farmacia/listar'),
                    api.get('/laboratorio/listar')
                ]);
                setMedicamentos(medsRes.data);
                setAnalisis(labsRes.data);

                // 2. Buscar datos de la Cita para sacar el ID Paciente
                const citaRes = await api.get(`/cita/${idCita}`);
                const idPaciente = citaRes.data.idPaciente;

                // 3. Buscar DNI del Paciente
                const pacienteRes = await api.get(`/paciente/${idPaciente}`);
                const dni = pacienteRes.data.documento;

                // 4. Trae todo el expediente
                const expedienteRes = await api.get(`/orquestador/expediente/${dni}`);

                setPaciente(expedienteRes.data.paciente);
                setHistoria(expedienteRes.data.historia);
                setHistorialAtenciones(expedienteRes.data.atenciones || []);

            } catch (error) {
                console.error("Error cargando expediente:", error);
                alert("Error cargando datos del paciente.");
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, [idCita]);

    const agregarMedicamento = () => {
        if (!medSeleccionado || !dosis) return;
        const medObj = medicamentos.find(m => m.idMedicamento == medSeleccionado);
        if (medObj) {
            setRecetaItems([...recetaItems, { idMedicamento: medSeleccionado, nombre: medObj.nombre, dosis }]);
            setDosis('');
        }
    };

    const agregarAnalisis = () => {
        if (!anaSeleccionado) return;
        const anaObj = analisis.find(a => a.idTipoAnalisis == anaSeleccionado);
        if (anaObj) {
            setAnalisisItems([...analisisItems, { 
                idTipoAnalisis: anaSeleccionado, 
                nombreAnalisis: anaObj.nombre, 
                indicaciones: indicaciones || 'Sin indicaciones' 
            }]);
            setIndicaciones('');
            setAnaSeleccionado('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            idCita: idCita,
            diagnostico, tratamiento, observaciones,
            receta: recetaItems,
            ordenesAnalisis: analisisItems
        };
        try {
            await api.post('/atencion/registrar', payload);
            toast.success("¡Historia clínica y receta guardadas correctamente!");
            navigate('/medico/agenda');
        } catch (err) {
            toast.error("Hubo un error al guardar la historia clínica");
            console.error(err);
        }
    };

    if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;

    return (
        <Container fluid className="p-4">
            {/* CABECERA DEL PACIENTE */}
            <Card className="mb-4 border-0 shadow-sm bg-primary text-white">
                <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="mb-0"><FaUserInjured className="me-2" /> {paciente?.nombre}</h2>
                        <small>DNI: {paciente?.documento} | Tel: {paciente?.telefono} | Edad: {calcularEdad(paciente?.fechaNac)}{calcularEdad(paciente?.fechaNac) !== 'N/A' ? ' años' : ''}</small>
                    </div>
                    <div className="text-end">
                        <Badge bg="light" text="dark" className="me-2">Peso: {historia?.peso || 'N/A'}</Badge>
                        <Badge bg="light" text="dark">Talla: {historia?.talla || 'N/A'}</Badge>
                    </div>
                </Card.Body>
            </Card>

            <Row>
                {/* HISTORIAL */}
                <Col lg={4}>
                    <Card className="shadow-sm h-100">
                        <Card.Header className="bg-white border-bottom">
                            <h5 className="mb-0 text-secondary"><FaHistory className="me-2" /> Historial Médico</h5>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {historialAtenciones.length === 0 ? (
                                <p className="text-muted text-center mt-3">No hay atenciones previas.</p>
                            ) : (
                                <Accordion>
                                    {historialAtenciones.map((at, idx) => (
                                        <Accordion.Item eventKey={String(idx)} key={at.idAtencion}>
                                            <Accordion.Header>
                                                <small className="me-2 text-muted">{new Date(at.fechaAtencion || Date.now()).toLocaleDateString()}</small>
                                                <strong>{at.diagnostico}</strong>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <p><strong>Tratamiento:</strong> {at.tratamiento}</p>
                                                 {/* Si tienes infoCita enriquecida, muéstrala */}
                                                 {at.infoCita && (
                                                     <small className="text-muted d-block mb-2">
                                                         Atendido por Dr. {at.infoCita.infoMedico || at.nombreMedico || (at.idPersonal ? `ID: ${at.idPersonal}` : `ID: ${at.infoCita.idEncargado}`)}
                                                     </small>
                                                 )}

                                                {at.receta && at.receta.length > 0 && (
                                                    <div className="bg-light p-2 rounded">
                                                        <strong className="text-success"><FaFilePrescription /> Receta:</strong>
                                                        <ul className="mb-0 ps-3 small">
                                                            {at.receta.map((r, i) => (
                                                                <li key={i}>{r.nombreMedicamento} ({r.dosis})</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* ATENCIÓN FORMULARIO */}
                <Col lg={8}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white border-bottom">
                            <h5 className="mb-0 text-primary">Nueva Consulta (Cita #{idCita})</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Diagnóstico</Form.Label>
                                            <Form.Control as="textarea" rows={3} required value={diagnostico} onChange={e => setDiagnostico(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tratamiento</Form.Label>
                                            <Form.Control as="textarea" rows={3} required value={tratamiento} onChange={e => setTratamiento(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Observaciones Adicionales</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                value={observaciones}
                                                onChange={e => setObservaciones(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <hr className="my-4" />

                                <h6 className="text-success"><FaFilePrescription className="me-2" /> Receta Médica</h6>
                                <Row className="align-items-end mb-3">
                                    <Col md={5}>
                                        <Form.Label>Medicamento</Form.Label>
                                        <Form.Select value={medSeleccionado} onChange={e => setMedSeleccionado(e.target.value)}>
                                            <option value="">Buscar...</option>
                                            {medicamentos.map(m => <option key={m.idMedicamento} value={m.idMedicamento}>{m.nombre}</option>)}
                                        </Form.Select>
                                    </Col>
                                    <Col md={5}>
                                        <Form.Label>Dosis</Form.Label>
                                        <Form.Control placeholder="Ej: 1 c/8h" value={dosis} onChange={e => setDosis(e.target.value)} />
                                    </Col>
                                    <Col md={2}>
                                        <Button variant="outline-success" className="w-100" onClick={agregarMedicamento}>Agregar</Button>
                                    </Col>
                                </Row>

                                {recetaItems.length > 0 && (
                                    <Table size="sm" bordered>
                                        <thead><tr><th>Medicamento</th><th>Dosis</th></tr></thead>
                                        <tbody>
                                            {recetaItems.map((item, idx) => (
                                                <tr key={idx}><td>{item.nombre}</td><td>{item.dosis}</td></tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}

                                <hr className="my-4" />

                                <h6 className="text-info"><FaVials className="me-2" /> Análisis de Laboratorio</h6>
                                <Row className="align-items-end mb-3">
                                    <Col md={5}>
                                        <Form.Label>Análisis</Form.Label>
                                        <Form.Select value={anaSeleccionado} onChange={e => setAnaSeleccionado(e.target.value)}>
                                            <option value="">Buscar...</option>
                                            {analisis.map(a => <option key={a.idTipoAnalisis} value={a.idTipoAnalisis}>{a.nombre}</option>)}
                                        </Form.Select>
                                    </Col>
                                    <Col md={5}>
                                        <Form.Label>Indicaciones</Form.Label>
                                        <Form.Control placeholder="Ej: En ayunas" value={indicaciones} onChange={e => setIndicaciones(e.target.value)} />
                                    </Col>
                                    <Col md={2}>
                                        <Button variant="outline-info" className="w-100" onClick={agregarAnalisis}>Agregar</Button>
                                    </Col>
                                </Row>

                                {analisisItems.length > 0 && (
                                    <Table size="sm" bordered>
                                        <thead><tr><th>Análisis</th><th>Indicaciones</th></tr></thead>
                                        <tbody>
                                            {analisisItems.map((item, idx) => (
                                                <tr key={idx}><td>{item.nombreAnalisis}</td><td>{item.indicaciones}</td></tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}

                                <div className="text-end mt-4">
                                    <Button variant="secondary" className="me-2" onClick={() => navigate('/medico/agenda')}>Cancelar</Button>
                                    <Button variant="primary" size="lg" type="submit">Finalizar y Guardar Historia</Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AtencionMedica;