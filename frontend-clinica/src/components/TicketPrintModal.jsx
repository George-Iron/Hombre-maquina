import { Modal, Button, Table } from 'react-bootstrap';

const TicketPrintModal = ({ show, onHide, cobroData }) => {
    if (!cobroData) return null;

    const {
        idCita = '',
        nombrePaciente = '',
        dniPaciente = '',
        infoMedico = '',
        especialidad = '',
        monto = '0.00',
        cajeroNombre = 'Cajero de Turno',
        fechaCobro = new Date().toLocaleString('es-PE')
    } = cobroData;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Modal show={show} onHide={onHide} centered className="print-modal">
            <Modal.Header closeButton className="no-print">
                <Modal.Title>Comprobante de Pago</Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-3">
                {/* TICKET DE COBRO ESTILIZADO */}
                <div className="printable-document p-4 bg-white text-dark border border-secondary border-opacity-25 rounded" style={{ fontFamily: 'monospace, sans-serif', maxWidth: '400px', margin: '0 auto' }}>
                    
                    <div className="text-center mb-3 border-bottom pb-2">
                        <h4 className="fw-bold mb-0">CENTRO MÉDICO VIRTUAL</h4>
                        <small className="d-block text-muted">RUC: 20601234567</small>
                        <small className="d-block text-muted">Av. San Martín 456 - Lima</small>
                        <div className="fw-bold border border-dark border-opacity-50 p-1 mt-2 rounded">
                            BOLETA DE VENTA ELECTRÓNICA<br />
                            N° B001-000{idCita}
                        </div>
                    </div>

                    <div className="small mb-3">
                        <div><strong>Fecha/Hora:</strong> {fechaCobro}</div>
                        <div><strong>Cajero:</strong> {cajeroNombre}</div>
                        <div><strong>Paciente:</strong> {nombrePaciente}</div>
                        {dniPaciente && <div><strong>DNI:</strong> {dniPaciente}</div>}
                    </div>

                    <Table size="sm" bordered className="small align-middle mb-3">
                        <thead className="table-light text-center">
                            <tr>
                                <th>Descripción</th>
                                <th style={{ width: '80px' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    Consulta Médica - {especialidad || 'Atención Médica'}<br />
                                    <small className="text-muted">{infoMedico}</small>
                                </td>
                                <td className="text-end fw-bold">S/ {monto}</td>
                            </tr>
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between align-items-center fw-bold border-top border-bottom py-2 mb-3 fs-6">
                        <span>TOTAL PAGADO:</span>
                        <span>S/ {monto}</span>
                    </div>

                    <div className="text-center small text-muted">
                        <div>¡Gracias por su confianza!</div>
                        <div>Conserve este comprobante para su atención.</div>
                    </div>

                </div>
            </Modal.Body>

            <Modal.Footer className="no-print">
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={handlePrint}>
                    🖨️ Imprimir Ticket / PDF
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TicketPrintModal;
