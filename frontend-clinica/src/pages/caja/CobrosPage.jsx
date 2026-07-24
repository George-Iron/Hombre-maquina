import { useState, useEffect, useContext } from 'react';
import api from '../../config/axios';
import { AuthContext } from '../../context/AuthProvider';
import { Container, Table, Button, Card, Form, InputGroup, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import TicketPrintModal from '../../components/TicketPrintModal';

const CobrosPage = () => {
    const { user } = useContext(AuthContext);
    
    const [listaCompleta, setListaCompleta] = useState([]);
    const [listaFiltrada, setListaFiltrada] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedCita, setSelectedCita] = useState(null);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [cobroData, setCobroData] = useState(null);

    const cargarPendientes = async () => {
        try {
            const res = await api.get('/cita/pendientes');
            setListaCompleta(res.data);
            setListaFiltrada(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Error cargando lista de cobros");
        }
    };

    useEffect(() => { cargarPendientes(); }, []);

    const handleBuscar = (e) => {
        const termino = e.target.value.toLowerCase();
        setBusqueda(termino);

        const filtrados = listaCompleta.filter(cita => 
            cita.nombrePaciente.toLowerCase().includes(termino)
        );
        setListaFiltrada(filtrados);
    };

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
            toast.success("Cobro exitoso.");
            setCobroData({
                idCita: selectedCita.idCita,
                nombrePaciente: selectedCita.nombrePaciente,
                dniPaciente: selectedCita.dniPaciente || '',
                infoMedico: selectedCita.infoMedico,
                monto: selectedCita.precio,
                cajeroNombre: user?.nombre || 'Cajero'
            });
            setShowTicketModal(true);
            cargarPendientes(); 
            setBusqueda('');
        } catch (error) {
            toast.error("Error al procesar pago");
            console.error(error);
        }
    };

    return (
        <Container className="p-0">
            <div className="page-header">
                <h2>Caja Central</h2>
                <p>Gestión de cobros y facturación de consultas médicas.</p>
            </div>
            
            <Card className="border-0">
                <Card.Header className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0" style={{ color: 'var(--text-secondary)' }}>Cola de Pagos ({listaFiltrada.length})</h5>
                        <Button variant="outline-secondary" size="sm" onClick={cargarPendientes} aria-label="Actualizar cola de pagos">Actualizar</Button>
                    </div>

                    {/* BARRA DE BÚSQUEDA */}
                    <InputGroup>
                        <Form.Control 
                            placeholder="Buscar por Nombre del Paciente..." 
                            value={busqueda}
                            onChange={handleBuscar}
                            aria-label="Buscar deudas por nombre de paciente"
                        />
                    </InputGroup>
                </Card.Header>

                <Card.Body className="p-0">
                    <div className="table-scroll">
                        <Table hover className="align-middle mb-0">
                            <thead>
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
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{cita.nombrePaciente}</div>
                                                <small className="text-muted" style={{ fontVariantNumeric: 'tabular-nums' }}>ID Cita: #{cita.idCita}</small>
                                            </div>
                                        </td>
                                        <td style={{ fontVariantNumeric: 'tabular-nums' }}>{cita.fechaCita} <br/><small className="text-muted">{cita.horaCita}</small></td>
                                        <td>{cita.infoMedico}</td>
                                        <td style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--accent)', fontSize: '1.05rem' }}>S/ {cita.precio}</td>
                                        <td>
                                            <Button variant="primary" size="sm" onClick={() => handleCobrarClick(cita)} aria-label={`Cobrar cita de ${cita.nombrePaciente}`}>
                                                Cobrar
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
                    <Modal.Title>Confirmar Pago</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro de procesar este cobro? Los datos se guardarán permanentemente en el sistema.
                    {selectedCita && (
                        <div className="mt-3 p-3 confirm-payment-details">
                            <strong>Paciente:</strong> {selectedCita.nombrePaciente}<br/>
                            <strong>Monto:</strong> S/ {selectedCita.precio}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowConfirmModal(false); setSelectedCita(null); }} aria-label="Cancelar cobro">
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleConfirmCobrar} aria-label="Confirmar y procesar cobro">
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Impresión de Ticket */}
            <TicketPrintModal 
                show={showTicketModal} 
                onHide={() => {
                    setShowTicketModal(false);
                    setSelectedCita(null);
                }} 
                cobroData={cobroData} 
            />
        </Container>
    );
};

export default CobrosPage;