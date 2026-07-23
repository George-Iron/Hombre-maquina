import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const GestionFarmacia = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [laboratorios, setLaboratorios] = useState([]);
    const [nombresPredefinidos, setNombresPredefinidos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ nombre: '', laboratorio: '', precio: '' });
    const [touched, setTouched] = useState({});

    const precioNum = parseFloat(form.precio);
    const isPrecioValido = !isNaN(precioNum) && precioNum > 0;
    const isFormValido = form.nombre && form.laboratorio && isPrecioValido;

    const cargar = async () => {
        try {
            const [resMeds, resLabs, resNombres] = await Promise.all([
                api.get('/farmacia/listar'),
                api.get('/farmacia/laboratorios'),
                api.get('/farmacia/nombres-predefinidos')
            ]);
            setMedicamentos(resMeds.data);
            setLaboratorios(resLabs.data);
            setNombresPredefinidos(resNombres.data);
        } catch (e) {
            console.error(e);
            try {
                const resMeds = await api.get('/farmacia/listar');
                setMedicamentos(resMeds.data);
            } catch (err) { console.error(err); }
        }
    };

    useEffect(() => { cargar(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValido) {
            toast.error("Complete todos los campos requeridos con datos válidos.");
            return;
        }
        try {
            await api.post('/farmacia/registrar', form);
            toast.success("Medicamento registrado con éxito.");
            setShowModal(false);
            setForm({ nombre: '', laboratorio: '', precio: '' });
            setTouched({});
            cargar();
        } catch (e) { 
            toast.error("Error al guardar medicamento."); 
            console.error(e);
        }
    };

    return (
        <Container fluid className="p-0">
            <div className="page-header">
                <h2>Gestión de Farmacia</h2>
            </div>

            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>Inventario de Medicamentos</h4>
                    <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                        + Nuevo Medicamento
                    </Button>
                </div>

                <div className="table-scroll">
                    <Table hover responsive className="align-middle mb-0">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Laboratorio</th>
                                <th>Precio Unitario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicamentos.map(m => (
                                <tr key={m.idMedicamento}>
                                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{m.idMedicamento}</td>
                                    <td style={{ fontWeight: 500 }}>{m.nombre}</td>
                                    <td>{m.laboratorio}</td>
                                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>S/ {m.precio}</td>
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
            </div>

            <Modal show={showModal} onHide={() => { setShowModal(false); setTouched({}); }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Medicamento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre Comercial</Form.Label>
                            <Form.Select 
                                required 
                                value={form.nombre}
                                onChange={e => {
                                    setForm({...form, nombre: e.target.value});
                                    setTouched({...touched, nombre: true});
                                }}
                                isInvalid={touched.nombre && !form.nombre}
                            >
                                <option value="">Seleccione un medicamento...</option>
                                {nombresPredefinidos.map((nom, index) => (
                                    <option key={index} value={nom}>{nom}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Debe seleccionar un medicamento.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Laboratorio</Form.Label>
                            <Form.Select 
                                required 
                                value={form.laboratorio}
                                onChange={e => {
                                    setForm({...form, laboratorio: e.target.value});
                                    setTouched({...touched, laboratorio: true});
                                }}
                                isInvalid={touched.laboratorio && !form.laboratorio}
                            >
                                <option value="">Seleccione un laboratorio...</option>
                                {laboratorios.map((lab, index) => (
                                    <option key={index} value={lab}>{lab}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Debe seleccionar un laboratorio.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio Unitario (S/)</Form.Label>
                            <Form.Control 
                                type="number" 
                                step="0.10" 
                                min="0.10"
                                required 
                                value={form.precio}
                                onChange={e => {
                                    setForm({...form, precio: e.target.value});
                                    setTouched({...touched, precio: true});
                                }} 
                                isInvalid={touched.precio && !isPrecioValido}
                            />
                            <Form.Control.Feedback type="invalid">
                                El precio debe ser un número mayor a 0.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={() => { setShowModal(false); setTouched({}); }}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary" disabled={!isFormValido}>
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