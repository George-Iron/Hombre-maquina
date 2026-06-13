import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const GestionFarmacia = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ nombre: '', laboratorio: '', precio: '' });

    const cargar = async () => {
        try {
            const res = await api.get('/farmacia/listar');
            setMedicamentos(res.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { cargar(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/farmacia/registrar', form);
            toast.success("Medicamento registrado");
            setShowModal(false);
            setForm({ nombre: '', laboratorio: '', precio: '' });
            cargar();
        } catch (e) { toast.error("Error al guardar"); }
    };

    return (
        <Container fluid className="p-4">
            <h2 className="mb-4">💊 Gestión de Farmacia</h2>

            <div className="card-modern p-4 mb-4 shadow-sm bg-white rounded">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Inventario de Medicamentos</h4>
                    <Button className="btn-primary-modern" onClick={() => setShowModal(true)}>
                        + Nuevo Medicamento
                    </Button>
                </div>

                <Table hover responsive className="align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th className="border-0 text-secondary">ID</th>
                            <th className="border-0 text-secondary">Nombre</th>
                            <th className="border-0 text-secondary">Laboratorio</th>
                            <th className="border-0 text-secondary">Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicamentos.map(m => (
                            <tr key={m.idMedicamento}>
                                <td>{m.idMedicamento}</td>
                                <td className="fw-bold">{m.nombre}</td>
                                <td>{m.laboratorio}</td>
                                <td>S/ {m.precio}</td>
                            </tr>
                        ))}
                        {medicamentos.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-muted">
                                    No hay medicamentos registrados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Medicamento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre Comercial</Form.Label>
                            <Form.Control 
                                required 
                                value={form.nombre}
                                onChange={e => setForm({...form, nombre: e.target.value})} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Laboratorio</Form.Label>
                            <Form.Control 
                                required 
                                value={form.laboratorio}
                                onChange={e => setForm({...form, laboratorio: e.target.value})} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio Unitario (S/)</Form.Label>
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
                            <Button type="submit" className="btn-primary-modern">
                                Guardar
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default GestionFarmacia;