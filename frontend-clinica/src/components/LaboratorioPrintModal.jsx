import { Modal, Button, Table, Badge } from 'react-bootstrap';

const LaboratorioPrintModal = ({ show, onHide, laboratorioData }) => {
    if (!laboratorioData) return null;

    const {
        idOrden = '101',
        paciente = {},
        nombreAnalisis = 'Hemograma Completo',
        resultado = 'Hemoglobina: 14.5 g/dL, Leucocitos: 7,500 /uL, Plaquetas: 250,000 /uL (Valores dentro del rango normal).',
        observaciones = 'Muestra procesada mediante espectrofotometría automatizada. Sin hallazgos patológicos.',
        estadoResultado = 'NORMAL',
        laboratoristaNombre = 'Lic. Tecnología Médica',
        fecha = new Date().toLocaleString('es-PE')
    } = laboratorioData;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered className="print-modal">
            <Modal.Header closeButton className="no-print">
                <Modal.Title>Informe de Resultados de Laboratorio</Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-4">
                <div className="printable-document p-4 bg-white text-dark border border-secondary border-opacity-25 rounded" style={{ fontFamily: 'Arial, sans-serif' }}>
                    
                    {/* CABECERA LABORATORIO */}
                    <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom border-2 border-warning">
                        <div>
                            <h3 className="fw-bold mb-0 text-dark">LABORATORIO CLÍNICO Y BIOMÉDICO</h3>
                            <p className="small text-muted mb-0">Centro Médico - Servicio Analítico Especializado</p>
                            <small className="text-secondary">RUC: 20601234567 | Av. San Martín 456 - Lima | Tel: (01) 456-7890</small>
                        </div>
                        <div className="text-end">
                            <div className="badge bg-warning text-dark fs-6 px-3 py-2">INFORME ANALÍTICO</div>
                            <div className="small text-muted mt-1">Orden N° L-{idOrden}</div>
                            <div className="small text-muted">Fecha: {fecha}</div>
                        </div>
                    </div>

                    {/* DATOS PACIENTE */}
                    <div className="row g-2 mb-4 p-3 bg-light rounded border border-secondary border-opacity-25" style={{ fontSize: '0.9rem' }}>
                        <div className="col-md-7">
                            <strong>Paciente:</strong> {paciente.nombre} {paciente.apellido}<br />
                            <strong>DNI / Doc:</strong> {paciente.documento || paciente.dni || 'N/A'}<br />
                            <strong>Teléfono:</strong> {paciente.telefono || 'N/A'}
                        </div>
                        <div className="col-md-5 text-md-end">
                            <strong>Prueba Solicitada:</strong><br />
                            <span className="fw-bold text-primary">{nombreAnalisis}</span><br />
                            <strong>Estado Clínico:</strong> <Badge bg={estadoResultado === 'ALTERADO' ? 'danger' : 'success'}>{estadoResultado}</Badge>
                        </div>
                    </div>

                    {/* DETALLE DEL RESULTADO */}
                    <div className="mb-4">
                        <h6 className="fw-bold text-uppercase text-secondary small mb-2">Resultado del Análisis Bioquímico:</h6>
                        <div className="p-3 border border-secondary border-opacity-25 rounded bg-white text-dark fw-semibold fs-6" style={{ whiteSpace: 'pre-line', minHeight: '80px' }}>
                            {resultado}
                        </div>
                    </div>

                    {observaciones && (
                        <div className="mb-4">
                            <h6 className="fw-bold text-uppercase text-secondary small mb-1">Observaciones / Conclusión Clínica:</h6>
                            <div className="p-2 border rounded bg-light text-dark small" style={{ whiteSpace: 'pre-line' }}>
                                {observaciones}
                            </div>
                        </div>
                    )}

                    {/* VALORES DE REFERENCIA ESTÁNDAR */}
                    <div className="mb-4">
                        <h6 className="fw-bold text-secondary small mb-1">Rango de Referencia Estándar:</h6>
                        <Table size="sm" bordered className="small align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Parámetro</th>
                                    <th>Rango Biológico de Referencia</th>
                                    <th>Unidades</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Glucosa en Ayunas</td>
                                    <td>70 - 100</td>
                                    <td>mg/dL</td>
                                </tr>
                                <tr>
                                    <td>Hemoglobina (Adulto)</td>
                                    <td>12.0 - 16.5</td>
                                    <td>g/dL</td>
                                </tr>
                                <tr>
                                    <td>Colesterol Total</td>
                                    <td>&lt; 200</td>
                                    <td>mg/dL</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>

                    {/* FIRMA TECNÓLOGO / LABORATORISTA */}
                    <div className="row mt-5 pt-4 align-items-end">
                        <div className="col-6">
                            <small className="text-muted d-block">Documento emitido con firma digital de laboratorio.</small>
                            <small className="text-muted">Resultados validados por control de calidad automatizado.</small>
                        </div>
                        <div className="col-6 text-center">
                            <div className="border-bottom border-dark mx-auto mb-1" style={{ width: '220px' }}></div>
                            <div className="fw-bold small">{laboratoristaNombre}</div>
                            <div className="text-muted small">Tecnólogo Médico - Registro C.T.M.P.</div>
                        </div>
                    </div>

                </div>
            </Modal.Body>

            <Modal.Footer className="no-print">
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
                <Button variant="warning" className="text-dark fw-semibold" onClick={handlePrint}>
                    🖨️ Imprimir Informe de Laboratorio / PDF
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LaboratorioPrintModal;
