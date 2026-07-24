import { Modal, Button, Table } from 'react-bootstrap';

const RecetaPrintModal = ({ show, onHide, recetaData }) => {
    if (!recetaData) return null;

    const {
        paciente = {},
        doctorNombre = '',
        especialidad = '',
        diagnostico = '',
        tratamiento = '',
        observaciones = '',
        recetaItems = [],
        analisisItems = [],
        fecha = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })
    } = recetaData;

    const handlePrint = () => {
        window.print();
    };

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

    return (
        <Modal show={show} onHide={onHide} size="lg" centered className="print-modal">
            <Modal.Header closeButton className="no-print">
                <Modal.Title>Receta Médica y Prescripción</Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-4">
                {/* CONTENEDOR IMPRIMIBLE CON ESTILO PROFESIONAL */}
                <div className="printable-document p-4 bg-white text-dark rounded border border-light shadow-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
                    
                    {/* CABECERA DE LA CLÍNICA */}
                    <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom border-2 border-primary">
                        <div>
                            <h3 className="fw-bold mb-0 text-primary" style={{ letterSpacing: '0.5px' }}>CENTRO MÉDICO VIRTUAL</h3>
                            <p className="small text-muted mb-0">Excelencia en Atención y Salud Integral</p>
                            <small className="text-secondary">RUC: 20601234567 | Av. San Martín 456, Lima | Tel: (01) 456-7890</small>
                        </div>
                        <div className="text-end">
                            <div className="badge bg-primary fs-6 px-3 py-2">RECETA MÉDICA</div>
                            <div className="small text-muted mt-1">Fecha: {fecha}</div>
                        </div>
                    </div>

                    {/* DATOS DEL PACIENTE Y MÉDICO */}
                    <div className="row g-2 mb-3 p-3 bg-light rounded border border-secondary border-opacity-25" style={{ fontSize: '0.9rem' }}>
                        <div className="col-md-7">
                            <strong>Paciente:</strong> {paciente.nombre} {paciente.apellido}<br />
                            <strong>DNI / Doc:</strong> {paciente.documento || paciente.dni || 'N/A'} &nbsp;|&nbsp; 
                            <strong>Edad:</strong> {calcularEdadExacta(paciente.fechaNac)}<br />
                            <strong>Teléfono:</strong> {paciente.telefono || 'N/A'}
                        </div>
                        <div className="col-md-5 text-md-end">
                            <strong>Médico Tratante:</strong><br />
                            <span className="fw-semibold text-dark">{doctorNombre || 'Dr. Médico Especialista'}</span><br />
                            <span className="badge bg-info text-dark">{especialidad || 'Medicina General'}</span>
                        </div>
                    </div>

                    {/* DIAGNÓSTICO Y TRATAMIENTO */}
                    <div className="mb-3">
                        <h6 className="fw-bold text-uppercase text-secondary small mb-1">Diagnóstico Clínico:</h6>
                        <div className="p-2 border rounded bg-white text-dark" style={{ minHeight: '40px', fontSize: '0.92rem' }}>
                            {diagnostico || 'Evaluación médica general.'}
                        </div>
                    </div>

                    {tratamiento && (
                        <div className="mb-3">
                            <h6 className="fw-bold text-uppercase text-secondary small mb-1">Indicaciones de Tratamiento:</h6>
                            <div className="p-2 border rounded bg-white text-dark" style={{ fontSize: '0.92rem' }}>
                                {tratamiento}
                            </div>
                        </div>
                    )}

                    {/* PRESCRIPCIÓN DE MEDICAMENTOS (RP.) */}
                    {recetaItems && recetaItems.length > 0 && (
                        <div className="mb-4">
                            <h6 className="fw-bold text-primary mb-2">Rp. / PRESCRIPCIÓN MÉDICA:</h6>
                            <Table bordered hover size="sm" className="align-middle">
                                <thead className="table-secondary">
                                    <tr>
                                        <th style={{ width: '40px' }}>#</th>
                                        <th>Medicamento Prescrito</th>
                                        <th>Dosis e Indicaciones de Toma</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recetaItems.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="text-center fw-bold">{idx + 1}</td>
                                            <td className="fw-semibold">{item.nombre || item.nombreMedicamento}</td>
                                            <td>{item.dosis}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}

                    {/* ÓRDENES DE LABORATORIO */}
                    {analisisItems && analisisItems.length > 0 && (
                        <div className="mb-4">
                            <h6 className="fw-bold text-info mb-2">ÓRDENES DE ANÁLISIS DE LABORATORIO:</h6>
                            <Table bordered hover size="sm" className="align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '40px' }}>#</th>
                                        <th>Tipo de Análisis</th>
                                        <th>Indicaciones Previas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analisisItems.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="text-center fw-bold">{idx + 1}</td>
                                            <td className="fw-semibold">{item.nombreAnalisis || item.nombre}</td>
                                            <td>{item.indicaciones || 'Sin indicaciones especiales'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}

                    {observaciones && (
                        <div className="mb-3 small text-muted">
                            <strong>Observaciones adicionales:</strong> {observaciones}
                        </div>
                    )}

                    {/* FIRMA Y SELLO DEL MÉDICO */}
                    <div className="row mt-5 pt-4 align-items-end">
                        <div className="col-6">
                            <small className="text-muted d-block">Documento emitido electrónicamente.</small>
                            <small className="text-muted">Válido para ser presentado en Farmacia y Laboratorio.</small>
                        </div>
                        <div className="col-6 text-center">
                            <div className="border-bottom border-dark mx-auto mb-1" style={{ width: '200px' }}></div>
                            <div className="fw-bold small">{doctorNombre || 'Firma del Médico'}</div>
                            <div className="text-muted small">{especialidad || 'Especialista'}</div>
                        </div>
                    </div>

                </div>
            </Modal.Body>

            <Modal.Footer className="no-print">
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={handlePrint}>
                    🖨️ Imprimir / Guardar en PDF
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RecetaPrintModal;
