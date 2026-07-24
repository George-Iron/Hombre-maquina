import { useState } from 'react';
import { Card, Row, Col, Badge, Button, Form, Modal, Table } from 'react-bootstrap';

const CalendarioCitas = ({ citas = [], onVerExpediente }) => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [diaSeleccionado, setDiaSeleccionado] = useState(null);
    const [showDiaModal, setShowDiaModal] = useState(false);

    const year = fechaSeleccionada.getFullYear();
    const month = fechaSeleccionada.getMonth();

    const primerDiaMes = new Date(year, month, 1).getDay(); // 0: Domingo, 1: Lunes...
    const totalDiasMes = new Date(year, month + 1, 0).getDate();

    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const cambiarMes = (offset) => {
        setFechaSeleccionada(new Date(year, month + offset, 1));
    };

    // Agrupar citas por fechaYYYYMMDD
    const citasPorFecha = {};
    const safeCitas = Array.isArray(citas) ? citas : [];
    safeCitas.forEach(c => {
        const fechaStr = c.fechaCita || '2026-07-23';
        if (!citasPorFecha[fechaStr]) citasPorFecha[fechaStr] = [];
        citasPorFecha[fechaStr].push(c);
    });

    const abrirDetalleDia = (diaNum) => {
        const mesPad = String(month + 1).padStart(2, '0');
        const diaPad = String(diaNum).padStart(2, '0');
        const fechaKey = `${year}-${mesPad}-${diaPad}`;
        
        setDiaSeleccionado({
            diaNum,
            fechaKey,
            citas: citasPorFecha[fechaKey] || []
        });
        setShowDiaModal(true);
    };

    // Crear grilla de días
    const celdasVaciasInicio = primerDiaMes === 0 ? 6 : primerDiaMes - 1; // Empezar en Lunes
    const diasArray = Array.from({ length: totalDiasMes }, (_, i) => i + 1);

    return (
        <div>
            {/* CONTROLES DE NAVEGACIÓN DE MES */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <Button variant="outline-primary" size="sm" onClick={() => cambiarMes(-1)}>
                        ◀ Mes Anterior
                    </Button>
                    <h4 className="mb-0 text-primary fw-bold">
                        📅 {nombresMeses[month]} {year}
                    </h4>
                    <Button variant="outline-primary" size="sm" onClick={() => cambiarMes(1)}>
                        Mes Siguiente ▶
                    </Button>
                </Card.Body>
            </Card>

            {/* GRILLA DEL CALENDARIO */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table bordered className="text-center align-middle mb-0" style={{ tableLayout: 'fixed' }}>
                            <thead className="bg-light">
                                <tr>
                                    <th className="py-2 text-secondary">Lun</th>
                                    <th className="py-2 text-secondary">Mar</th>
                                    <th className="py-2 text-secondary">Mié</th>
                                    <th className="py-2 text-secondary">Jue</th>
                                    <th className="py-2 text-secondary">Vie</th>
                                    <th className="py-2 text-secondary">Sáb</th>
                                    <th className="py-2 text-danger">Dom</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: Math.ceil((celdasVaciasInicio + totalDiasMes) / 7) }).map((_, weekIdx) => (
                                    <tr key={weekIdx} style={{ height: '90px' }}>
                                        {Array.from({ length: 7 }).map((_, dayIdx) => {
                                            const cellIndex = weekIdx * 7 + dayIdx;
                                            const dayNum = cellIndex - celdasVaciasInicio + 1;

                                            if (dayNum <= 0 || dayNum > totalDiasMes) {
                                                return <td key={dayIdx} className="bg-light opacity-50"></td>;
                                            }

                                            const mesPad = String(month + 1).padStart(2, '0');
                                            const diaPad = String(dayNum).padStart(2, '0');
                                            const fechaKey = `${year}-${mesPad}-${diaPad}`;
                                            const listCitas = citasPorFecha[fechaKey] || [];
                                            const esHoy = new Date().getDate() === dayNum && new Date().getMonth() === month && new Date().getFullYear() === year;

                                            return (
                                                <td 
                                                    key={dayIdx} 
                                                    onClick={() => abrirDetalleDia(dayNum)}
                                                    style={{ 
                                                        cursor: 'pointer', 
                                                        backgroundColor: esHoy ? 'var(--surface-hover)' : 'white',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    className="align-top p-2 hover-shadow"
                                                >
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <span className={`fw-bold small px-2 py-1 rounded-circle ${esHoy ? 'bg-primary text-white' : 'text-dark'}`}>
                                                            {dayNum}
                                                        </span>
                                                        {listCitas.length > 0 && (
                                                            <Badge bg="primary" pill>
                                                                {listCitas.length}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="d-flex flex-column gap-1 overflow-hidden" style={{ maxHeight: '55px' }}>
                                                        {listCitas.slice(0, 2).map(c => (
                                                            <div key={c.idCita} className="small text-truncate p-1 bg-primary bg-opacity-10 text-primary rounded" style={{ fontSize: '0.7rem' }}>
                                                                {c.horaCita || '09:00'} {c.nombrePaciente?.split(' ')[0]}
                                                            </div>
                                                        ))}
                                                        {listCitas.length > 2 && (
                                                            <small className="text-muted text-center" style={{ fontSize: '0.65rem' }}>
                                                                +{listCitas.length - 2} más...
                                                            </small>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* MODAL DETALLE DE CITAS DEL DÍA */}
            <Modal show={showDiaModal} onHide={() => setShowDiaModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        📅 Citas Programadas ({diaSeleccionado?.diaNum} de {nombresMeses[month]} {year})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {diaSeleccionado?.citas.length === 0 ? (
                        <div className="text-center p-4 text-muted">
                            No hay citas agendadas para esta fecha.
                        </div>
                    ) : (
                        <Table hover responsive className="align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Hora</th>
                                    <th>Paciente</th>
                                    <th>Doctor / Especialidad</th>
                                    <th>Estado</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {diaSeleccionado?.citas.map(c => (
                                    <tr key={c.idCita}>
                                        <td className="fw-bold text-primary">{c.horaCita || '09:00 AM'}</td>
                                        <td>
                                            <div className="fw-semibold">{c.nombrePaciente}</div>
                                            <small className="text-muted">DNI: {c.dniPaciente}</small>
                                        </td>
                                        <td>{c.infoMedico}</td>
                                        <td>
                                            <Badge bg={c.estado === 'PAGADA' ? 'success' : c.estado === 'ATENDIDA' ? 'info' : 'warning'}>
                                                {c.estado}
                                            </Badge>
                                        </td>
                                        <td>
                                            {c.dniPaciente && (
                                                <Button 
                                                    variant="outline-info" 
                                                    size="sm" 
                                                    onClick={() => {
                                                        setShowDiaModal(false);
                                                        if (onVerExpediente) onVerExpediente(c.dniPaciente);
                                                    }}
                                                >
                                                    📋 Expediente
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CalendarioCitas;
