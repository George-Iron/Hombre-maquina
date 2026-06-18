import { useState, useEffect, useContext } from 'react';
import api from '../../config/axios';
import { AuthContext } from '../../context/AuthProvider';
import { Container, Table, Button, Badge, Card, Form, InputGroup, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaCashRegister, FaSearch, FaUserCircle } from 'react-icons/fa';

const CobrosPage = () => {
    const { user } = useContext(AuthContext);
    
    const [listaCompleta, setListaCompleta] = useState([]); // Todos los deudores
    const [listaFiltrada, setListaFiltrada] = useState([]); // Lo que se ve en pantalla
    const [busqueda, setBusqueda] = useState(''); // Texto del input
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedCita, setSelectedCita] = useState(null);

    // 1. CARGAR TODOS LOS PENDIENTES (Sin importar fecha)
    const cargarPendientes = async () => {
        try {
            // Usamos el nuevo endpoint del backend
            const res = await api.get('/cita/pendientes');
            setListaCompleta(res.data);
            setListaFiltrada(res.data); // Al inicio mostramos todo
        } catch (error) {
            console.error(error);
            toast.error("Error cargando lista de cobros");
        }
    };

    useEffect(() => { cargarPendientes(); }, []);

    // 2. FILTRO EN TIEMPO REAL (Por DNI o Nombre)
    const handleBuscar = (e) => {
        const termino = e.target.value.toLowerCase();
        setBusqueda(termino);

        const filtrados = listaCompleta.filter(cita => 
            // Tu backend no devuelve el DNI directo en la cita, pero sí el nombre
            // Si quieres buscar por DNI, asegúrate de que ms-citas devuelva el DNI del paciente en el JSON
            // Por ahora buscaremos por NOMBRE DEL PACIENTE que sí lo tienes
            cita.nombrePaciente.toLowerCase().includes(termino)
        );
        setListaFiltrada(filtrados);
    };

    // 3. PROCESAR PAGO
    const handleCobrarClick = (cita) => {
        setSelectedCita(cita);
        setShowConfirmModal(true);
    };

    const handleConfirmCobrar = async () => {
        if (!selectedCita) return;
        setShowConfirmModal(false);

        const payload = {
            idCita: selectedCita.idCita,
            idCajero: user.id,
            montoTotal: selectedCita.precio
        };

        try {
            await api.post('/facturacion/generar', payload);
            toast.success("✅ Cobro exitoso");
            cargarPendientes(); 
            setBusqueda('');
            setSelectedCita(null);
        } catch (error) {
            toast.error("Error al procesar pago");
            console.error(error);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="text-success mb-4"><FaCashRegister title="Icono Caja Registradora"/> Caja Central</h2>
            
            <Card className="shadow border-0 mx-1 mx-md-0">
                <Card.Header className="bg-white p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0 text-secondary">Cola de Pagos ({listaFiltrada.length})</h5>
                        <Button variant="outline-success" size="sm" onClick={cargarPendientes} aria-label="Actualizar cola de pagos">🔄 Actualizar</Button>
                    </div>

                    {/* BARRA DE BÚSQUEDA */}
                    <InputGroup size="lg">
                        <InputGroup.Text className="bg-success text-white"><FaSearch title="Icono Lupa de Búsqueda"/></InputGroup.Text>
                        <Form.Control 
                            placeholder="Buscar por Nombre del Paciente..." 
                            value={busqueda}
                            onChange={handleBuscar}
                            aria-label="Buscar deudas por nombre de paciente"
                        />
                    </InputGroup>
                </Card.Header>

                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                            <thead className="bg-light">
                                <tr className="text-nowrap">
                                    <th className="ps-4" style={{ minWidth: '220px' }}>Paciente</th>
                                    <th style={{ minWidth: '140px' }}>Fecha Cita</th>
                                    <th style={{ minWidth: '160px' }}>Médico</th>
                                    <th style={{ minWidth: '100px' }}>Monto</th>
                                    <th style={{ minWidth: '100px' }}>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaFiltrada.map(cita => (
                                    <tr key={cita.idCita}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-light rounded-circle p-2 me-3 text-secondary"><FaUserCircle size={20} title="Icono de Usuario Paciente"/></div>
                                                <div>
                                                    <div className="fw-bold">{cita.nombrePaciente}</div>
                                                    <small className="text-muted">ID Cita: #{cita.idCita}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{cita.fechaCita} <br/><small className="text-muted">{cita.horaCita}</small></td>
                                        <td>{cita.infoMedico}</td>
                                        <td className="fw-bold text-success fs-5">S/ {cita.precio}</td>
                                        <td>
                                            <Button variant="success" onClick={() => handleCobrarClick(cita)} aria-label={`Cobrar cita de ${cita.nombrePaciente}`}>
                                                Cobrar 💵
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {listaFiltrada.length === 0 && (
                                    <tr><td colSpan="5" className="text-center p-5 text-muted">No se encontraron deudas pendientes.</td></tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Modal de Confirmación para Caja */}
            <Modal show={showConfirmModal} onHide={() => { setShowConfirmModal(false); setSelectedCita(null); }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Acción Crítica</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro de procesar esta acción crítica? Los datos se guardarán permanentemente en el sistema.
                    {selectedCita && (
                        <div className="mt-3 p-3 rounded confirm-payment-details">
                            <strong>Paciente:</strong> {selectedCita.nombrePaciente}<br/>
                            <strong>Monto:</strong> S/ {selectedCita.precio}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowConfirmModal(false); setSelectedCita(null); }} aria-label="Cancelar cobro">
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={handleConfirmCobrar} aria-label="Confirmar y procesar cobro">
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CobrosPage;