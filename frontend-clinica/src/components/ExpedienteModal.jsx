import { useState, useEffect } from 'react';
import api from '../config/axios';
import { Modal, Button, Tabs, Tab, Badge, Card, Table, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import RecetaPrintModal from './RecetaPrintModal';

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

const calcularIMC = (peso, talla) => {
    const p = parseFloat(peso);
    const t = parseFloat(talla);
    if (isNaN(p) || isNaN(t) || t <= 0) return { val: 'N/A', cat: '', bg: 'secondary' };
    const imc = p / (t * t);
    const val = imc.toFixed(1);
    if (imc < 18.5) return { val, cat: 'Bajo Peso', bg: 'warning' };
    if (imc < 25) return { val, cat: 'Peso Normal', bg: 'success' };
    if (imc < 30) return { val, cat: 'Sobrepeso', bg: 'warning' };
    return { val, cat: 'Obesidad', bg: 'danger' };
};

const ExpedienteModal = ({ show, onHide, dniPaciente }) => {
    const [loading, setLoading] = useState(false);
    const [expediente, setExpediente] = useState(null);

    // Estado para imprimir receta específica del historial
    const [showRecetaModal, setShowRecetaModal] = useState(false);
    const [recetaImprimir, setRecetaImprimir] = useState(null);

    useEffect(() => {
        if (show && dniPaciente) {
            cargarExpediente();
        }
    }, [show, dniPaciente]);

    const cargarExpediente = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/orquestador/expediente/${dniPaciente}`);
            setExpediente(res.data);
        } catch (error) {
            console.error("Error al cargar expediente 360:", error);
            toast.error("No se pudo cargar el expediente completo del paciente.");
            setExpediente(null);
        } finally {
            setLoading(false);
        }
    };

    const handlePrintExpediente = () => {
        window.print();
    };

    const paciente = expediente?.paciente || {};
    const historia = expediente?.historia || {};
    const atenciones = expediente?.atenciones || [];

    const imcObj = calcularIMC(historia.peso, historia.talla);

    // Recopilar todos los medicamentos recetados acumulados
    const todosMedicamentosRecetados = atenciones.flatMap(at => 
        (at.receta || []).map(r => ({
            ...r,
            fecha: at.fechaAtencion || 'Fecha N/A',
            diagnostico: at.diagnostico
        }))
    );

    return (
        <>
            <Modal show={show} onHide={onHide} size="xl" centered className="print-modal">
                <Modal.Header closeButton className="no-print">
                    <Modal.Title className="d-flex align-items-center gap-2">
                        <span>📋 Expediente Médico 360°</span>
                        <Badge bg="primary" className="fw-normal fs-6">Documento Oficial</Badge>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="p-4">
                    {loading ? (
                        <div className="text-center p-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="text-muted mt-2">Cargando expediente 360° del paciente...</p>
                        </div>
                    ) : !expediente ? (
                        <div className="text-center p-4 text-muted">
                            No se encontraron registros médicos para el paciente con DNI {dniPaciente}.
                        </div>
                    ) : (
                        <div className="printable-document p-3">
                            
                            {/* CABECERA Y DATOS GENERALES DEL PACIENTE */}
                            <Card className="mb-4 border-0 shadow-sm" style={{ borderLeft: '5px solid var(--accent)' }}>
                                <Card.Body className="p-3">
                                    <Row className="align-items-center">
                                        <Col md={7}>
                                            <h3 className="fw-bold mb-1 text-primary">
                                                {paciente.nombre} {paciente.apellido}
                                            </h3>
                                            <p className="text-secondary mb-0 small">
                                                <strong>DNI / Doc:</strong> {paciente.documento} &nbsp;|&nbsp; 
                                                <strong>Edad Exacta:</strong> {calcularEdadExacta(paciente.fechaNac)} ({paciente.fechaNac || 'N/A'}) &nbsp;|&nbsp; 
                                                <strong>Teléfono:</strong> {paciente.telefono || 'N/A'}
                                            </p>
                                        </Col>
                                        <Col md={5} className="mt-3 mt-md-0">
                                            <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                                                <Badge bg="light" className="text-dark p-2 border">
                                                    <strong>Peso:</strong> {historia.peso ? `${historia.peso} kg` : 'Sin registro'}
                                                </Badge>
                                                <Badge bg="light" className="text-dark p-2 border">
                                                    <strong>Talla:</strong> {historia.talla ? `${historia.talla} m` : 'Sin registro'}
                                                </Badge>
                                                {imcObj.val !== 'N/A' && (
                                                    <Badge bg={imcObj.bg} className="p-2 fs-6">
                                                        IMC: {imcObj.val} ({imcObj.cat})
                                                    </Badge>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* CONTENIDO PESTAÑAS */}
                            <Tabs defaultActiveKey="consultas" id="expediente-tabs" className="mb-3 no-print">
                                
                                {/* PESTAÑA 1: ATENCIONES MÉDICAS */}
                                <Tab eventKey="consultas" title={`Consultas Médicas (${atenciones.length})`}>
                                    {atenciones.length === 0 ? (
                                        <p className="text-muted p-4 text-center">No hay registros de atenciones médicas registradas.</p>
                                    ) : (
                                        <div className="d-flex flex-column gap-3 mt-3">
                                            {atenciones.map((at, idx) => (
                                                <Card key={at.idAtencion || idx} className="border border-secondary border-opacity-25 shadow-sm">
                                                    <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                                                        <div>
                                                            <strong className="text-dark">Consulta #{at.idAtencion || idx + 1}</strong>
                                                            <small className="text-muted ms-2">
                                                                Fecha: {at.fechaAtencion ? new Date(at.fechaAtencion).toLocaleDateString('es-PE') : 'Fecha N/A'}
                                                            </small>
                                                        </div>
                                                        <div className="small text-secondary">
                                                            Doctor: {at.infoCita?.infoMedico || at.nombreMedico || 'Médico Tratante'}
                                                        </div>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Row>
                                                            <Col md={6}>
                                                                <h6 className="fw-bold text-primary small text-uppercase mb-1">Diagnóstico:</h6>
                                                                <p className="p-2 bg-light rounded text-dark small">{at.diagnostico || 'Sin diagnóstico registrado.'}</p>
                                                            </Col>
                                                            <Col md={6}>
                                                                <h6 className="fw-bold text-success small text-uppercase mb-1">Tratamiento:</h6>
                                                                <p className="p-2 bg-light rounded text-dark small">{at.tratamiento || 'Sin tratamiento prescripto.'}</p>
                                                            </Col>
                                                        </Row>

                                                        {/* MEDICAMENTOS DE LA CONSULTA */}
                                                        {at.receta && at.receta.length > 0 && (
                                                            <div className="mt-2 p-2 border rounded bg-white">
                                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                                    <strong className="small text-success">Prescripción de Medicamentos:</strong>
                                                                    <Button 
                                                                        variant="outline-primary" 
                                                                        size="sm" 
                                                                        className="no-print py-0 px-2"
                                                                        style={{ fontSize: '0.75rem' }}
                                                                        onClick={() => {
                                                                            setRecetaImprimir({
                                                                                paciente,
                                                                                doctorNombre: at.infoCita?.infoMedico || at.nombreMedico || 'Doctor',
                                                                                diagnostico: at.diagnostico,
                                                                                tratamiento: at.tratamiento,
                                                                                recetaItems: at.receta.map(r => ({ nombre: r.nombreMedicamento || r.nombre, dosis: r.dosis }))
                                                                            });
                                                                            setShowRecetaModal(true);
                                                                        }}
                                                                    >
                                                                        🖨️ Imprimir Receta
                                                                    </Button>
                                                                </div>
                                                                <ul className="mb-0 ps-3 small">
                                                                    {at.receta.map((r, i) => (
                                                                        <li key={i}>{r.nombreMedicamento || r.nombre} - <em>{r.dosis}</em></li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {/* ÓRDENES DE LABORATORIO */}
                                                        {at.ordenesAnalisis && at.ordenesAnalisis.length > 0 && (
                                                            <div className="mt-2 p-2 border rounded bg-white">
                                                                <strong className="small text-info">Órdenes de Análisis:</strong>
                                                                <ul className="mb-0 ps-3 small">
                                                                    {at.ordenesAnalisis.map((ord, i) => (
                                                                        <li key={i}>{ord.nombreAnalisis || ord.nombre} ({ord.indicaciones || 'Ayunas'})</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </Card.Body>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </Tab>

                                {/* PESTAÑA 2: HISTORIAL DE TRIAJE / SIGNOS VITALES */}
                                <Tab eventKey="triaje" title="Triaje y Signos Vitales">
                                    <div className="mt-3">
                                        <h6 className="fw-bold mb-3">Último Registro de Antropometría:</h6>
                                        <Table bordered responsive size="sm" className="align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Peso (kg)</th>
                                                    <th>Talla (m)</th>
                                                    <th>Índice de Masa Corporal (IMC)</th>
                                                    <th>Estado Nutricional</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="fw-semibold">{historia.peso ? `${historia.peso} kg` : 'Sin registro'}</td>
                                                    <td className="fw-semibold">{historia.talla ? `${historia.talla} m` : 'Sin registro'}</td>
                                                    <td className="fw-bold">{imcObj.val}</td>
                                                    <td>
                                                        <Badge bg={imcObj.bg}>{imcObj.cat || 'N/A'}</Badge>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </Tab>

                                {/* PESTAÑA 3: ACUMULADO DE MEDICAMENTOS */}
                                <Tab eventKey="medicamentos" title={`Histórico de Medicación (${todosMedicamentosRecetados.length})`}>
                                    <div className="mt-3">
                                        {todosMedicamentosRecetados.length === 0 ? (
                                            <p className="text-muted p-4 text-center">No se le han prescripto medicamentos al paciente aún.</p>
                                        ) : (
                                            <Table hover responsive size="sm" className="align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Fecha</th>
                                                        <th>Medicamento</th>
                                                        <th>Dosis / Posología</th>
                                                        <th>Asociado al Diagnóstico</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {todosMedicamentosRecetados.map((m, idx) => (
                                                        <tr key={idx}>
                                                            <td>{m.fecha}</td>
                                                            <td className="fw-semibold">{m.nombreMedicamento || m.nombre}</td>
                                                            <td>{m.dosis}</td>
                                                            <td className="small text-muted">{m.diagnostico}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        )}
                                    </div>
                                </Tab>

                            </Tabs>

                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer className="no-print">
                    <Button variant="secondary" onClick={onHide}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handlePrintExpediente} disabled={!expediente}>
                        🖨️ Imprimir Expediente Completo / PDF
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal secundario para imprimir receta específica */}
            <RecetaPrintModal 
                show={showRecetaModal} 
                onHide={() => setShowRecetaModal(false)} 
                recetaData={recetaImprimir} 
            />
        </>
    );
};

export default ExpedienteModal;
