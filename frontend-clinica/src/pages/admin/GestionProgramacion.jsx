import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Container, Row, Col, Form, Button, Table, Tabs, Tab } from 'react-bootstrap';
import { toast } from 'react-toastify';

const GestionProgramacion = () => {
    const [consultorios, setConsultorios] = useState([]);
    const [doctores, setDoctores] = useState([]); // Para el select
    const [turnos, setTurnos] = useState([]); // Todos los turnos
    
    // Formulario Consultorio
    const [nombreCons, setNombreCons] = useState('');

    // Formulario Horario
    const [formHorario, setFormHorario] = useState({ idMedico: '', idConsultorio: '', fecha: '', horaInicio: '' });

    // CARGAR DATOS INICIALES
    useEffect(() => {
        cargarConsultorios();
        cargarDoctores();
        cargarTurnos();
    }, []);

    const cargarTurnos = async () => {
        try {
            const res = await api.get('/programacion/horario/listar');
            setTurnos(res.data);
        } catch (error) {
            toast.error("Error al cargar los turnos");
            console.error(error);
        }
    };

    const cargarConsultorios = async () => {
        const res = await api.get('/programacion/consultorio/listar');
        setConsultorios(res.data);
    };

    const cargarDoctores = async () => {
        const res = await api.get('/personal/listar/DOCTOR');
        setDoctores(res.data);
    };

    // GUARDAR CONSULTORIO
    const handleGuardarConsultorio = async (e) => {
        e.preventDefault();
        try {
            await api.post('/programacion/consultorio/registrar', { nombre: nombreCons });
            toast.success("¡Consultorio registrado con éxito!");
            setNombreCons('');
            cargarConsultorios();
        } catch (error) { 
            toast.error("Error al crear consultorio"); 
            console.error(error);
        }
    };

    // GUARDAR HORARIO
    const handleGuardarHorario = async (e) => {
        e.preventDefault();
        // Armar el payload complejo que espera el backend
        const payload = {
            idMedico: formHorario.idMedico,
            consultorio: { idConsultorio: formHorario.idConsultorio },
            fecha: formHorario.fecha,
            horaInicio: formHorario.horaInicio + ":00" // Agregar segundos si es necesario
        };

        try {
            await api.post('/programacion/horario/registrar', payload);
            toast.success("¡Horario programado con éxito!");
            setFormHorario({ idMedico: '', idConsultorio: '', fecha: '', horaInicio: '' });
            cargarTurnos();
        } catch (error) { 
            toast.error("Error: Posible cruce de horarios"); 
            console.error(error);
        }
    };

    const renderEstadoBadge = (estado) => {
        let bg = '#f3f4f6';
        let color = '#374151';
        
        if (estado === 'LIBRE') {
            bg = '#def7ec';
            color = '#03543f';
        } else if (estado === 'PENDIENTE') {
            bg = '#fef3c7';
            color = '#92400e';
        } else if (estado === 'OCUPADO') {
            bg = '#e1effe';
            color = '#1e429f';
        }
        
        return (
            <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ backgroundColor: bg, color: color, fontSize: '0.85rem' }}>
                {estado}
            </span>
        );
    };

    return (
        <Container fluid className="p-4">
            <h2 className="mb-4">🏥 Gestión de Infraestructura</h2>

            <div className="card-modern p-4 mb-4 shadow-sm bg-white rounded">
                <Tabs defaultActiveKey="horarios" className="mb-4">
                    
                    {/* TAB 1: ASIGNAR HORARIOS */}
                    <Tab eventKey="horarios" title="Asignar Horarios">
                        <div className="p-2">
                            <h4 className="mb-4 text-secondary">Programar Turno Médico</h4>
                            <Form onSubmit={handleGuardarHorario}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Médico</Form.Label>
                                            <Form.Select required onChange={e => setFormHorario({...formHorario, idMedico: e.target.value})} value={formHorario.idMedico}>
                                                <option value="">Seleccione Doctor...</option>
                                                {doctores.map(d => (
                                                    <option key={d.idEmpleado} value={d.idEmpleado}>{d.nombre} {d.apellido} ({d.especialidad})</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Consultorio</Form.Label>
                                            <Form.Select required onChange={e => setFormHorario({...formHorario, idConsultorio: e.target.value})} value={formHorario.idConsultorio}>
                                                <option value="">Seleccione Consultorio...</option>
                                                {consultorios.map(c => (
                                                    <option key={c.idConsultorio} value={c.idConsultorio}>{c.nombre}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Fecha</Form.Label>
                                            <Form.Control type="date" required onChange={e => setFormHorario({...formHorario, fecha: e.target.value})} value={formHorario.fecha} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Hora Inicio</Form.Label>
                                            <Form.Control type="time" required onChange={e => setFormHorario({...formHorario, horaInicio: e.target.value})} value={formHorario.horaInicio} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-end mt-3">
                                    <Button type="submit" className="btn-primary-modern px-4">
                                        Guardar Programación
                                    </Button>
                                </div>
                            </Form>

                            {/* TABLA DE TURNOS REGISTRADOS */}
                            <div className="mt-5 border-top pt-4">
                                <h5 className="mb-4 text-secondary">Turnos Programados Registrados</h5>
                                <div className="border rounded overflow-hidden shadow-sm">
                                    <Table hover responsive className="align-middle mb-0 bg-white">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="p-3 text-secondary border-0">Médico</th>
                                                <th className="p-3 text-secondary border-0">Consultorio / Ambiente</th>
                                                <th className="p-3 text-secondary border-0">Fecha</th>
                                                <th className="p-3 text-secondary border-0">Hora Inicio</th>
                                                <th className="p-3 text-secondary border-0">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {turnos.map(t => (
                                                <tr key={t.idProgramacion}>
                                                    <td className="p-3">
                                                        <div className="fw-semibold text-dark">{t.nombreMedico}</div>
                                                        <small className="text-muted">{t.especialidadMedico}</small>
                                                    </td>
                                                    <td className="p-3 text-dark">{t.consultorio ? t.consultorio.nombre : 'Sin consultorio'}</td>
                                                    <td className="p-3 text-dark">{t.fecha}</td>
                                                    <td className="p-3 text-dark">{t.horaInicio}</td>
                                                    <td className="p-3">
                                                        {renderEstadoBadge(t.estadoTurno)}
                                                    </td>
                                                </tr>
                                            ))}
                                            {turnos.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="text-center p-4 text-muted">
                                                        No hay turnos programados en el sistema
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </Tab>

                    {/* TAB 2: CREAR CONSULTORIOS */}
                    <Tab eventKey="consultorios" title="Consultorios">
                        <Row className="g-4 mt-2">
                            <Col md={4}>
                                <div className="bg-light p-4 rounded border">
                                    <h5 className="mb-3">Nuevo Consultorio</h5>
                                    <Form onSubmit={handleGuardarConsultorio}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre / Número</Form.Label>
                                            <Form.Control 
                                                placeholder="Ej: Consultorio 204 - Rayos X" 
                                                value={nombreCons} 
                                                onChange={e => setNombreCons(e.target.value)} 
                                                required 
                                            />
                                        </Form.Group>
                                        <Button type="submit" className="btn-primary-modern w-100">
                                            Crear
                                        </Button>
                                    </Form>
                                </div>
                            </Col>
                            <Col md={8}>
                                <div className="border rounded overflow-hidden">
                                    <Table hover responsive className="align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="border-0 text-secondary p-3">ID</th>
                                                <th className="border-0 text-secondary p-3">Nombre del Consultorio</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {consultorios.map(c => (
                                                <tr key={c.idConsultorio}>
                                                    <td className="p-3">{c.idConsultorio}</td>
                                                    <td className="p-3 fw-bold">{c.nombre}</td>
                                                </tr>
                                            ))}
                                            {consultorios.length === 0 && (
                                                <tr><td colSpan="2" className="text-center p-3 text-muted">No hay consultorios registrados</td></tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    </Tab>
                </Tabs>
            </div>
        </Container>
    );
};
export default GestionProgramacion;