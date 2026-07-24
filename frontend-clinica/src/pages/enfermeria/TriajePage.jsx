import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { AuthContext } from '../../context/AuthProvider';
import { Container, Card, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import TriajePrintModal from '../../components/TriajePrintModal';
import { logAuditAction } from '../../utils/auditLogger';

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

const TriajePage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [dni, setDni] = useState('');
    const [paciente, setPaciente] = useState(null);
    const [historia, setHistoria] = useState(null);
    
    // Signos Vitales
    const [peso, setPeso] = useState('');
    const [talla, setTalla] = useState('');
    const [presionSistolica, setPresionSistolica] = useState('120');
    const [presionDiastolica, setPresionDiastolica] = useState('80');
    const [temperatura, setTemperatura] = useState('36.5');
    const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState('75');
    const [saturacionOxigeno, setSaturacionOxigeno] = useState('98');

    const [pacienteNoEncontrado, setPacienteNoEncontrado] = useState(false);
    const [touched, setTouched] = useState({ peso: false, talla: false });

    // Modal de Impresión
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [triajePrintData, setTriajePrintData] = useState(null);

    // Validaciones
    const pesoNum = parseFloat(peso);
    const tallaNum = parseFloat(talla);
    const isPesoValido = !isNaN(pesoNum) && pesoNum >= 0.5 && pesoNum <= 400.0;
    const isTallaValida = !isNaN(tallaNum) && tallaNum >= 0.30 && tallaNum <= 2.50;
    const isTriajeValido = paciente && isPesoValido && isTallaValida;
    const isDniSearchValid = /^\d{8}$/.test(dni);

    const imcObj = calcularIMC(peso, talla);

    // Alertas de signos vitales
    const alertas = [];
    const sys = parseInt(presionSistolica);
    const dia = parseInt(presionDiastolica);
    const temp = parseFloat(temperatura);
    const spo2 = parseInt(saturacionOxigeno);

    if (!isNaN(sys) && sys >= 140) alertas.push(`Hipertensión Sistólica: ${sys} mmHg`);
    if (!isNaN(dia) && dia >= 90) alertas.push(`Hipertensión Diastólica: ${dia} mmHg`);
    if (!isNaN(temp) && temp >= 38.0) alertas.push(`Fiebre Detectada: ${temp} °C`);
    if (!isNaN(temp) && temp <= 35.5) alertas.push(`Hipotermia Detectada: ${temp} °C`);
    if (!isNaN(spo2) && spo2 < 95) alertas.push(`Saturación de Oxígeno Baja: ${spo2}%`);

    const handleDniChange = (e) => {
        setDni(e.target.value.replace(/\D/g, '').slice(0, 8));
    };

    const buscarPaciente = async (e) => {
        e.preventDefault();
        if (!isDniSearchValid) {
            toast.error("Ingrese un DNI válido de 8 dígitos.");
            return;
        }
        setPacienteNoEncontrado(false);
        try {
            const resPac = await api.get(`/paciente/buscar/${dni}`);
            setPaciente(resPac.data);
            
            try {
                const resHist = await api.get(`/historia/paciente/${resPac.data.idPaciente}`);
                setHistoria(resHist.data);
                setPeso(resHist.data.peso || '70.0');
                setTalla(resHist.data.talla || '1.70');
            } catch (err) {
                setHistoria(null);
                setPeso('70.0');
                setTalla('1.70');
            }
        } catch (error) {
            toast.error("Paciente no encontrado en la base de datos.");
            setPaciente(null);
            setPacienteNoEncontrado(true);
        }
    };

    const guardarTriaje = async () => {
        if (!isTriajeValido) {
            toast.error("Verifique que el peso (0.5-400 kg) y la talla (0.3-2.5 m) sean válidos.");
            return;
        }

        const payload = {
            idPaciente: paciente.idPaciente,
            peso: String(pesoNum),
            talla: String(tallaNum),
            estado: "ACTIVO"
        };

        try {
            await api.post('/historia/registrar', payload);
            
            logAuditAction({
                usuario: user?.nombre || 'Enfermera',
                rol: 'ENFERMERA',
                accion: 'REGISTRO',
                modulo: 'Historia Clínica',
                detalle: `Registró signos vitales y triaje para ${paciente.nombre} (DNI ${paciente.documento})`
            });

            const dataPrint = {
                paciente,
                peso: String(pesoNum),
                talla: String(tallaNum),
                imc: imcObj,
                presionArterial: `${presionSistolica}/${presionDiastolica}`,
                temperatura,
                frecuenciaCardiaca,
                saturacionOxigeno,
                alertas,
                enfermeraNombre: user?.nombre || 'Enfermera de Turno'
            };

            setTriajePrintData(dataPrint);
            setShowPrintModal(true);

            toast.success(`Triaje registrado exitosamente para ${paciente.nombre}.`);
        } catch (error) {
            toast.error("Error al guardar el triaje.");
            console.error(error);
        }
    };

    return (
        <Container className="p-0" fluid>
            <div className="page-header">
                <h2>Estación de Triaje y Signos Vitales</h2>
                <p>Registro de signos vitales, antropometría y detección de alertas médicas del paciente.</p>
            </div>

            <Row className="g-3">
                {/* --- COLUMNA 1: BÚSQUEDA PACIENTE --- */}
                <Col md={4}>
                    <Card className="border-0 mb-4 shadow-sm">
                        <Card.Header className="bg-light">
                            <h5 className="mb-0 text-secondary">1. Identificar Paciente</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={buscarPaciente} className="d-flex gap-2" noValidate>
                                <Form.Control 
                                    placeholder="Ingrese DNI (8 dígitos)" 
                                    value={dni} 
                                    maxLength={8}
                                    inputMode="numeric"
                                    onChange={handleDniChange} 
                                    isInvalid={dni.length > 0 && !isDniSearchValid}
                                />
                                <Button type="submit" variant="outline-primary" disabled={!isDniSearchValid} aria-label="Buscar paciente por DNI">Buscar</Button>
                            </Form>
                            {dni.length > 0 && !isDniSearchValid && (
                                <small style={{ color: 'var(--semantic-danger)', marginTop: '4px', display: 'block' }}>
                                    El DNI debe tener 8 dígitos numéricos.
                                </small>
                            )}

                            {paciente && (
                                <Alert variant="success" className="mt-3 mb-0 text-center">
                                    <h5 className="mb-1">{paciente.nombre} {paciente.apellido}</h5>
                                    <div><strong>DNI:</strong> {paciente.documento}</div>
                                    <div><strong>Edad Exacta:</strong> {calcularEdadExacta(paciente.fechaNac)}</div>
                                    <div><strong>Teléfono:</strong> {paciente.telefono || 'N/A'}</div>
                                </Alert>
                            )}

                            {pacienteNoEncontrado && !paciente && (
                                <div className="mt-3 text-center">
                                    <Alert variant="warning" className="mb-2">El paciente no existe en la base de datos.</Alert>
                                    <Button variant="primary" size="sm" onClick={() => navigate('/recepcion/pacientes')}>
                                        Ir al Padrón de Pacientes
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* ALERTAS EN TIEMPO REAL */}
                    {paciente && alertas.length > 0 && (
                        <Card className="border-danger shadow-sm">
                            <Card.Header className="bg-danger text-white">
                                <h6 className="mb-0">⚠️ Alertas de Salud Detectadas ({alertas.length})</h6>
                            </Card.Header>
                            <Card.Body>
                                <ul className="mb-0 ps-3">
                                    {alertas.map((alt, idx) => (
                                        <li key={idx} className="text-danger fw-bold">{alt}</li>
                                    ))}
                                </ul>
                            </Card.Body>
                        </Card>
                    )}
                </Col>

                {/* --- COLUMNA 2: SIGNOS VITALES COMPLETOS --- */}
                <Col md={8}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-light">
                            <h5 className="mb-0 text-secondary">2. Registro de Signos Vitales</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form noValidate>
                                <h6 className="text-primary mb-3">Antropometría:</h6>
                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Label>Peso (kg)</Form.Label>
                                        <Form.Control 
                                            disabled={!paciente}
                                            value={peso} 
                                            onChange={e => setPeso(e.target.value)} 
                                            onBlur={() => setTouched(prev => ({ ...prev, peso: true }))}
                                            placeholder="Ej: 70.5"
                                            isInvalid={touched.peso && !isPesoValido}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label>Talla (m)</Form.Label>
                                        <Form.Control 
                                            disabled={!paciente}
                                            value={talla} 
                                            onChange={e => setTalla(e.target.value)} 
                                            onBlur={() => setTouched(prev => ({ ...prev, talla: true }))}
                                            placeholder="Ej: 1.75"
                                            isInvalid={touched.talla && !isTallaValida}
                                        />
                                    </Col>
                                    <Col md={4} className="d-flex flex-column justify-content-end">
                                        <Form.Label>IMC e Indicador:</Form.Label>
                                        <div>
                                            <Badge bg={imcObj.bg} className="p-2 fs-6 w-100">
                                                IMC: {imcObj.val} {imcObj.cat ? `(${imcObj.cat})` : ''}
                                            </Badge>
                                        </div>
                                    </Col>
                                </Row>

                                <hr />

                                <h6 className="text-primary mb-3">Funciones Vitales:</h6>
                                <Row className="mb-3 g-3">
                                    <Col md={3}>
                                        <Form.Label>Presión Sistólica</Form.Label>
                                        <Form.Control 
                                            disabled={!paciente}
                                            value={presionSistolica} 
                                            onChange={e => setPresionSistolica(e.target.value)} 
                                            placeholder="120"
                                        />
                                        <small className="text-muted">mmHg</small>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Label>Presión Diastólica</Form.Label>
                                        <Form.Control 
                                            disabled={!paciente}
                                            value={presionDiastolica} 
                                            onChange={e => setPresionDiastolica(e.target.value)} 
                                            placeholder="80"
                                        />
                                        <small className="text-muted">mmHg</small>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Label>Temperatura (°C)</Form.Label>
                                        <Form.Control 
                                            disabled={!paciente}
                                            value={temperatura} 
                                            onChange={e => setTemperatura(e.target.value)} 
                                            placeholder="36.5"
                                        />
                                        <small className="text-muted">Normal: 36-37.5°C</small>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Label>Sat. Oxígeno (%)</Form.Label>
                                        <Form.Control 
                                            disabled={!paciente}
                                            value={saturacionOxigeno} 
                                            onChange={e => setSaturacionOxigeno(e.target.value)} 
                                            placeholder="98"
                                        />
                                        <small className="text-muted">SpO2 Normal: &gt;95%</small>
                                    </Col>
                                </Row>

                                <Button 
                                    className="w-100 mt-3" 
                                    variant="success" 
                                    size="lg"
                                    disabled={!isTriajeValido}
                                    onClick={guardarTriaje}
                                >
                                    💾 Guardar Triaje e Imprimir Comprobante
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* MODAL DE IMPRESIÓN FICHA DE TRIAJE */}
            <TriajePrintModal 
                show={showPrintModal} 
                onHide={() => {
                    setShowPrintModal(false);
                    setPaciente(null);
                    setDni('');
                }} 
                triajeData={triajePrintData} 
            />
        </Container>
    );
};

export default TriajePage;