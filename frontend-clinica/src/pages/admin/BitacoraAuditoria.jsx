import { useState, useEffect } from 'react';
import { Container, Table, Card, Button, Form, Row, Col, Badge, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getAuditLogs, clearAuditLogs } from '../../utils/auditLogger';

const BitacoraAuditoria = () => {
    const [logs, setLogs] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtroModulo, setFiltroModulo] = useState('TODOS');
    const [filtroRol, setFiltroRol] = useState('TODOS');

    useEffect(() => {
        cargarLogs();
    }, []);

    const cargarLogs = () => {
        const data = getAuditLogs();
        setLogs(data);
    };

    const handleLimpiar = () => {
        if (window.confirm("¿Está seguro de borrar todo el historial de auditoría?")) {
            clearAuditLogs();
            setLogs([]);
            toast.info("Historial de auditoría limpiado.");
        }
    };

    const handleExportarCSV = () => {
        if (logs.length === 0) return toast.warning("No hay registros para exportar.");
        
        let csv = "ID,Fecha,Usuario,Rol,Modulo,Accion,Detalle\n";
        logs.forEach(l => {
            csv += `"${l.id}","${l.fecha}","${l.usuario}","${l.rol}","${l.modulo}","${l.accion}","${l.detalle.replace(/"/g, '""')}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Bitacora_Auditoria_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Bitácora descargada en formato CSV.");
    };

    const logsFiltrados = logs.filter(l => {
        const termino = busqueda.toLowerCase().trim();
        const matchText = (l.usuario || '').toLowerCase().includes(termino) || (l.detalle || '').toLowerCase().includes(termino) || (l.modulo || '').toLowerCase().includes(termino);
        const matchModulo = filtroModulo === 'TODOS' || l.modulo === filtroModulo;
        const matchRol = filtroRol === 'TODOS' || l.rol === filtroRol;
        return matchText && matchModulo && matchRol;
    });

    const renderAccionBadge = (accion) => {
        if (accion === 'REGISTRO' || accion === 'CREACIÓN') return <Badge bg="success">CREACIÓN</Badge>;
        if (accion === 'ACTUALIZACIÓN' || accion === 'EDICIÓN') return <Badge bg="warning" text="dark">EDICIÓN</Badge>;
        if (accion === 'ELIMINACIÓN' || accion === 'CANCELACIÓN') return <Badge bg="danger">ELIMINACIÓN</Badge>;
        if (accion === 'COBRO') return <Badge bg="primary">COBRO</Badge>;
        if (accion === 'ATENCIÓN') return <Badge bg="info">ATENCIÓN</Badge>;
        return <Badge bg="secondary">{accion}</Badge>;
    };

    return (
        <Container fluid className="p-0">
            <header className="page-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                    <h1>Bitácora de Auditoría y Seguridad</h1>
                    <p>Registro continuo de actividades, operaciones y trazabilidad de usuarios.</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-danger" size="sm" onClick={handleLimpiar} disabled={logs.length === 0}>
                        🗑️ Limpiar Bitácora
                    </Button>
                    <Button variant="outline-success" size="sm" onClick={handleExportarCSV} disabled={logs.length === 0}>
                        📥 Exportar CSV
                    </Button>
                </div>
            </header>

            {/* TARJETAS RESUMEN AUDITORÍA */}
            <Row className="g-3 mb-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm" style={{ borderLeft: '4px solid var(--accent)' }}>
                        <Card.Body>
                            <small className="text-muted d-block text-uppercase fw-semibold">Eventos Registrados</small>
                            <div className="fs-3 fw-bold text-primary mt-1">{logs.length}</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm" style={{ borderLeft: '4px solid var(--semantic-info)' }}>
                        <Card.Body>
                            <small className="text-muted d-block text-uppercase fw-semibold">Módulos Monitoreados</small>
                            <div className="fs-3 fw-bold text-dark mt-1">5 Módulos</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm" style={{ borderLeft: '4px solid var(--semantic-success)' }}>
                        <Card.Body>
                            <small className="text-muted d-block text-uppercase fw-semibold">Trazabilidad de Roles</small>
                            <div className="fs-3 fw-bold text-success mt-1">100% Activa</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* FILTROS Y TABLA */}
            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h4 style={{ margin: 0 }}>Historial de Actividades</h4>

                    <div className="d-flex gap-2 flex-wrap align-items-center">
                        <Form.Select 
                            size="sm" 
                            value={filtroModulo} 
                            onChange={e => setFiltroModulo(e.target.value)}
                            style={{ width: '150px' }}
                        >
                            <option value="TODOS">Todos Módulos</option>
                            <option value="Farmacia">Farmacia</option>
                            <option value="Pacientes">Pacientes</option>
                            <option value="Caja">Caja</option>
                            <option value="Citas">Citas</option>
                            <option value="Historia Clínica">Historia Clínica</option>
                        </Form.Select>

                        <Form.Select 
                            size="sm" 
                            value={filtroRol} 
                            onChange={e => setFiltroRol(e.target.value)}
                            style={{ width: '140px' }}
                        >
                            <option value="TODOS">Todos Roles</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="DOCTOR">DOCTOR</option>
                            <option value="RECEPCIONISTA">RECEPCIONISTA</option>
                            <option value="CAJERO">CAJERO</option>
                        </Form.Select>

                        <InputGroup size="sm" style={{ maxWidth: '220px' }}>
                            <Form.Control 
                                placeholder="Buscar actividad..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                            />
                            {busqueda && (
                                <Button variant="outline-secondary" onClick={() => setBusqueda('')}>✕</Button>
                            )}
                        </InputGroup>
                    </div>
                </div>

                <div className="table-scroll">
                    <Table hover responsive className="align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Fecha / Hora</th>
                                <th>Usuario</th>
                                <th>Rol</th>
                                <th>Módulo</th>
                                <th>Acción</th>
                                <th>Detalle de la Operación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logsFiltrados.map(l => (
                                <tr key={l.id}>
                                    <td style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }} className="small text-muted">{l.fecha}</td>
                                    <td className="fw-semibold text-dark">{l.usuario}</td>
                                    <td><Badge bg="secondary">{l.rol}</Badge></td>
                                    <td className="fw-bold">{l.modulo}</td>
                                    <td>{renderAccionBadge(l.accion)}</td>
                                    <td className="small">{l.detalle}</td>
                                </tr>
                            ))}
                            {logsFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center p-4 text-muted">
                                        No hay registros de auditoría que coincidan con los filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </Container>
    );
};

export default BitacoraAuditoria;
