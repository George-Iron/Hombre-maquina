import { Modal, Button, Table, Badge } from 'react-bootstrap';

const TriajePrintModal = ({ show, onHide, triajeData }) => {
    if (!triajeData) return null;

    const {
        paciente = {},
        peso = '',
        talla = '',
        imc = {},
        presionArterial = '120/80',
        temperatura = '36.5',
        frecuenciaCardiaca = '75',
        saturacionOxigeno = '98',
        alertas = [],
        enfermeraNombre = 'Enfermería de Turno',
        fecha = new Date().toLocaleString('es-PE')
    } = triajeData;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Modal show={show} onHide={onHide} centered className="print-modal">
            <Modal.Header closeButton className="no-print">
                <Modal.Title>Ficha de Triaje y Signos Vitales</Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-3">
                <div className="printable-document p-4 bg-white text-dark border border-secondary border-opacity-25 rounded" style={{ fontFamily: 'Arial, sans-serif' }}>
                    
                    <div className="text-center pb-3 mb-3 border-bottom border-primary">
                        <h4 className="fw-bold mb-0 text-primary">CENTRO MÉDICO VIRTUAL</h4>
                        <small className="text-muted">Estación de Enfermería y Triaje</small><br/>
                        <span className="badge bg-primary px-3 py-1 mt-1">COMPROBANTE DE SIGNO VITALES</span>
                    </div>

                    <div className="small mb-3 p-2 bg-light rounded">
                        <div><strong>Fecha / Hora:</strong> {fecha}</div>
                        <div><strong>Enfermera(o):</strong> {enfermeraNombre}</div>
                        <div><strong>Paciente:</strong> {paciente.nombre} {paciente.apellido}</div>
                        <div><strong>DNI:</strong> {paciente.documento || paciente.dni || 'N/A'}</div>
                    </div>

                    <h6 className="fw-bold text-secondary mb-2 small text-uppercase">Mediciones Antropométricas y Vitales:</h6>
                    <Table size="sm" bordered hover className="align-middle mb-3 small">
                        <tbody>
                            <tr>
                                <td><strong>Peso:</strong> {peso} kg</td>
                                <td><strong>Talla:</strong> {talla} m</td>
                            </tr>
                            <tr>
                                <td><strong>IMC:</strong> {imc.val || 'N/A'}</td>
                                <td><strong>Estado Nutricional:</strong> <Badge bg={imc.bg || 'secondary'}>{imc.cat || 'N/A'}</Badge></td>
                            </tr>
                            <tr>
                                <td><strong>Presión Arterial:</strong> {presionArterial} mmHg</td>
                                <td><strong>Temperatura:</strong> {temperatura} °C</td>
                            </tr>
                            <tr>
                                <td><strong>Frecuencia Cardíaca:</strong> {frecuenciaCardiaca} BPM</td>
                                <td><strong>Sat. Oxígeno (SpO2):</strong> {saturacionOxigeno}%</td>
                            </tr>
                        </tbody>
                    </Table>

                    {alertas.length > 0 && (
                        <div className="mb-3 p-2 border border-danger rounded bg-danger bg-opacity-10 small">
                            <strong className="text-danger">⚠️ Alertas de Salud Detectadas:</strong>
                            <ul className="mb-0 ps-3">
                                {alertas.map((alt, i) => <li key={i} className="text-danger fw-bold">{alt}</li>)}
                            </ul>
                        </div>
                    )}

                    <div className="text-center mt-4 pt-3 border-top">
                        <small className="text-muted d-block">Documento para la evaluación de la consulta médica.</small>
                        <small className="text-muted">Pase a sala de espera para ser llamado por el Médico.</small>
                    </div>

                </div>
            </Modal.Body>

            <Modal.Footer className="no-print">
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={handlePrint}>
                    🖨️ Imprimir Ficha de Triaje / PDF
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TriajePrintModal;
