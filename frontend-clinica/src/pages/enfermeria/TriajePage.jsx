import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

const calcularEdad = (fecha) => {
    if (!fecha) return 'N/A';
    const anio = new Date(fecha).getFullYear();
    if (isNaN(anio)) return 'N/A';
    return new Date().getFullYear() - anio;
};

const TriajePage = () => {
    const navigate = useNavigate();
    const [dni, setDni] = useState('');
    const [paciente, setPaciente] = useState(null);
    const [historia, setHistoria] = useState(null);
    
    const [peso, setPeso] = useState('');
    const [talla, setTalla] = useState('');

    const [pacienteNoEncontrado, setPacienteNoEncontrado] = useState(false);
    const [touched, setTouched] = useState({ peso: false, talla: false });

    // Validaciones fisiológicas lógicas
    const pesoNum = parseFloat(peso);
    const tallaNum = parseFloat(talla);
    const isPesoValido = !isNaN(pesoNum) && pesoNum >= 0.5 && pesoNum <= 400.0;
    const isTallaValida = !isNaN(tallaNum) && tallaNum >= 0.30 && tallaNum <= 2.50;
    const isTriajeValido = paciente && isPesoValido && isTallaValida;
    const isDniSearchValid = /^\d{8}$/.test(dni);

    const handleDniChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 8);
        setDni(val);
    };

    const handlePesoChange = (e) => {
        const val = e.target.value;
        if (/^\d*\.?\d*$/.test(val)) {
            setPeso(val);
        }
    };

    const handleTallaChange = (e) => {
        const val = e.target.value;
        if (/^\d*\.?\d*$/.test(val)) {
            setTalla(val);
        }
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
                setPeso(resHist.data.peso || '');
                setTalla(resHist.data.talla || '');
            } catch (err) {
                setHistoria(null);
                setPeso('');
                setTalla('');
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
            toast.success(`Triaje guardado exitosamente para ${paciente.nombre}.`);
            setPaciente(null);
            setDni('');
            setPeso('');
            setTalla('');
            setTouched({ peso: false, talla: false });
        } catch (error) {
            toast.error("Error al guardar la historia clínica.");
            console.error(error);
        }
    };

    return (
        <Container className="p-0">
            <div className="page-header">
                <h2>Estación de Triaje</h2>
                <p>Registro de signos vitales y datos antropométricos del paciente.</p>
            </div>

            <Row className="g-3">
                <Col md={5}>
                    <Card className="border-0 mb-4">
                        <Card.Header>
                            <h5 className="mb-0">1. Buscar Paciente</h5>
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
                                <Alert variant="success" className="mt-3 mb-0">
                                    <strong>{paciente.nombre}</strong><br/>
                                    Edad aprox: {calcularEdad(paciente.fechaNac)}{calcularEdad(paciente.fechaNac) !== 'N/A' ? ' años' : ''}
                                </Alert>
                            )}

                            {pacienteNoEncontrado && !paciente && (
                                <div className="mt-3 text-center">
                                    <Alert variant="warning" className="mb-2">El paciente no existe en la base de datos.</Alert>
                                    <Button variant="primary" size="sm" onClick={() => navigate('/recepcion/citas')}>
                                        Registrar nuevo paciente
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={7}>
                    <Card className="border-0">
                        <Card.Header>
                            <h5 className="mb-0">2. Signos Vitales</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form noValidate>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Label>Peso (kg)</Form.Label>
                                        <Form.Control 
                                            disabled={!paciente}
                                            value={peso} 
                                            onChange={handlePesoChange} 
                                            onBlur={() => setTouched(prev => ({ ...prev, peso: true }))}
                                            placeholder="Ej: 70.5"
                                            isInvalid={touched.peso && !isPesoValido}
                                        />
                                        {touched.peso && !isPesoValido && (
                                            <Form.Control.Feedback type="invalid">
                                                Ingrese un peso válido entre 0.5 y 400.0 kg.
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                    <Col>
                                        <Form.Label>Talla (m)</Form.Label>
                                        <Form.Control 
                                            disabled={!paciente}
                                            value={talla} 
                                            onChange={handleTallaChange} 
                                            onBlur={() => setTouched(prev => ({ ...prev, talla: true }))}
                                            placeholder="Ej: 1.75"
                                            isInvalid={touched.talla && !isTallaValida}
                                        />
                                        {touched.talla && !isTallaValida && (
                                            <Form.Control.Feedback type="invalid">
                                                Ingrese una talla válida entre 0.30 y 2.50 m.
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                </Row>
                                <Button 
                                    className="w-100" 
                                    variant="success" 
                                    disabled={!isTriajeValido}
                                    onClick={guardarTriaje}
                                >
                                    Actualizar Historia Clínica
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TriajePage;