import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const GestionLaboratorio = () => {
    const [analisis, setAnalisis] = useState([]);
    const [nombresPredefinidos, setNombresPredefinidos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '' });

    const cargar = async () => {
        try {
            const [resAnalisis, resNombres] = await Promise.all([
                api.get('/laboratorio/listar'),
                api.get('/laboratorio/nombres-predefinidos')
            ]);
            setAnalisis(resAnalisis.data);
            setNombresPredefinidos(resNombres.data);
        } catch (e) {
            console.error(e);
            try {
                const resAnalisis = await api.get('/laboratorio/listar');
                setAnalisis(resAnalisis.data);
            } catch (err) { console.error(err); }
        }
    };

    useEffect(() => { cargar(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/laboratorio/registrar', form);
            toast.success("Análisis registrado con éxito.");
            setShowModal(false);
            setForm({ nombre: '', descripcion: '', precio: '' });
            cargar();
        } catch (e) { 
            toast.error("Error al guardar análisis"); 
            console.error(e);
        }
    };

    return (
        <Container fluid className="p-0">
            <div className="page-header">
                <h2>Gestión de Laboratorio</h2>
            </div>

            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>Listado de Análisis</h4>
                    <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                        + Nuevo Análisis
                    </Button>
                </div>

                <Table hover responsive className="align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th className="border-0 text-secondary">ID</th>
                            <th className="border-0 text-secondary">Nombre</th>
                            <th className="border-0 text-secondary">Descripción</th>
                            <th className="border-0 text-secondary">Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {analisis.map(a => (
                            <tr key={a.idTipoAnalisis}>
                                <td>{a.idTipoAnalisis}</td>
                                <td className="fw-bold">{a.nombre}</td>
                                <td>{a.descripcion}</td>
                                <td>S/ {a.precio}</td>
                            </tr>
                        ))}
                        {analisis.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-muted">
                                    No hay análisis registrados en el sistema
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Tipo de Análisis</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Select 
                                required 
                                value={form.nombre}
                                onChange={e => setForm({...form, nombre: e.target.value})}
                            >
                                <option value="">Seleccione un análisis...</option>
                                {nombresPredefinidos.map((nom, index) => (
                                    <option key={index} value={nom}>{nom}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control 
                                required 
                                as="textarea" 
                                rows={2}
                                value={form.descripcion}
                                onChange={e => setForm({...form, descripcion: e.target.value})} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio (S/)</Form.Label>
                            <Form.Control 
                                type="number" 
                                step="0.1" 
                                required 
                                value={form.precio}
                                onChange={e => setForm({...form, precio: e.target.value})} 
                            />
                        </Form.Group>
                        
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary">
                                Guardar
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default GestionLaboratorio;