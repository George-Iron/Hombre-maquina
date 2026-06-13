import { useState } from 'react';
import api from '../../config/axios';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaWeight, FaRulerVertical, FaSearch, FaUserNurse } from 'react-icons/fa';

const TriajePage = () => {
    const [dni, setDni] = useState('');
    const [paciente, setPaciente] = useState(null);
    const [historia, setHistoria] = useState(null);
    
    // Datos a actualizar
    const [peso, setPeso] = useState('');
    const [talla, setTalla] = useState('');

    // 1. BUSCAR PACIENTE
    const buscarPaciente = async (e) => {
        e.preventDefault();
        try {
            // Buscar datos personales
            const resPac = await api.get(`/paciente/buscar/${dni}`);
            setPaciente(resPac.data);
            
            // Buscar historia existente (si tiene)
            try {
                const resHist = await api.get(`/historia/paciente/${resPac.data.idPaciente}`);
                setHistoria(resHist.data);
                // Pre-llenar datos si ya existen
                setPeso(resHist.data.peso || '');
                setTalla(resHist.data.talla || '');
            } catch (err) {
                setHistoria(null); // No tiene historia aún
                setPeso('');
                setTalla('');
            }
        } catch (error) {
            toast.error("Paciente no encontrado");
            setPaciente(null);
        }
    };

    // 2. GUARDAR TRIAJE
    const guardarTriaje = async () => {
        if (!paciente) return;

        const payload = {
            idPaciente: paciente.idPaciente,
            peso: peso,
            talla: talla,
            estado: "ACTIVO"
        };

        try {
            // Usamos el endpoint de registrar (que funciona como crear o actualizar en tu lógica simple)
            await api.post('/historia/registrar', payload);
            toast.success(`✅ Triaje guardado para ${paciente.nombre}`);
            // Limpiar
            setPaciente(null);
            setDni('');
        } catch (error) {
            toast.error("Error al guardar historia");
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="text-info mb-4"><FaUserNurse/> Estación de Triaje</h2>

            <Row>
                <Col md={5}>
                    <Card className="shadow-sm mb-4">
                        <Card.Header className="bg-info text-white">1. Buscar Paciente</Card.Header>
                        <Card.Body>
                            <Form onSubmit={buscarPaciente} className="d-flex gap-2">
                                <Form.Control 
                                    placeholder="Ingrese DNI" 
                                    value={dni} onChange={e => setDni(e.target.value)} 
                                />
                                <Button type="submit" variant="outline-info"><FaSearch/></Button>
                            </Form>

                            {paciente && (
                                <Alert variant="success" className="mt-3 mb-0">
                                    <strong>{paciente.nombre}</strong><br/>
                                    Edad aprox: {new Date().getFullYear() - new Date(paciente.fechaNac).getFullYear()} años
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={7}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-secondary text-white">2. Signos Vitales</Card.Header>
                        <Card.Body>
                            <Form>
                                <Row className="mb-3">
                                    <Col>
                                        <Form.Label><FaWeight/> Peso (kg)</Form.Label>
                                        <Form.Control 
                                            disabled={!paciente}
                                            value={peso} onChange={e => setPeso(e.target.value)} 
                                            placeholder="Ej: 70.5"
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Label><FaRulerVertical/> Talla (m)</Form.Label>
                                        <Form.Control 
                                            disabled={!paciente}
                                            value={talla} onChange={e => setTalla(e.target.value)} 
                                            placeholder="Ej: 1.75"
                                        />
                                    </Col>
                                </Row>
                                <Button 
                                    className="w-100" 
                                    variant="success" 
                                    disabled={!paciente}
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