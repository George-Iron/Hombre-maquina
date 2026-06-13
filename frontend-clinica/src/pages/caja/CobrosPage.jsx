import { useState, useEffect, useContext } from 'react';
import api from '../../config/axios';
import { AuthContext } from '../../context/AuthProvider';
import { Container, Table, Button, Badge, Card, Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaCashRegister, FaSearch, FaUserCircle } from 'react-icons/fa';

const CobrosPage = () => {
    const { user } = useContext(AuthContext);
    
    const [listaCompleta, setListaCompleta] = useState([]); // Todos los deudores
    const [listaFiltrada, setListaFiltrada] = useState([]); // Lo que se ve en pantalla
    const [busqueda, setBusqueda] = useState(''); // Texto del input

    // 1. CARGAR TODOS LOS PENDIENTES (Sin importar fecha)
    const cargarPendientes = async () => {
        try {
            // Usamos el nuevo endpoint del backend
            const res = await api.get('/cita/pendientes');
            setListaCompleta(res.data);
            setListaFiltrada(res.data); // Al inicio mostramos todo
        } catch (error) {
            console.error(error);
            toast.error("Error cargando lista de cobros");
        }
    };

    useEffect(() => { cargarPendientes(); }, []);

    // 2. FILTRO EN TIEMPO REAL (Por DNI o Nombre)
    const handleBuscar = (e) => {
        const termino = e.target.value.toLowerCase();
        setBusqueda(termino);

        const filtrados = listaCompleta.filter(cita => 
            // Tu backend no devuelve el DNI directo en la cita, pero sí el nombre
            // Si quieres buscar por DNI, asegúrate de que ms-citas devuelva el DNI del paciente en el JSON
            // Por ahora buscaremos por NOMBRE DEL PACIENTE que sí lo tienes
            cita.nombrePaciente.toLowerCase().includes(termino)
        );
        setListaFiltrada(filtrados);
    };

    // 3. PROCESAR PAGO
    const handleCobrar = async (cita) => {
        const confirmacion = confirm(`¿Cobrar S/ ${cita.precio} a ${cita.nombrePaciente}?`);
        if (!confirmacion) return;

        const payload = {
            idCita: cita.idCita,
            idCajero: user.id,
            montoTotal: cita.precio
        };

        try {
            await api.post('/facturacion/generar', payload);
            toast.success("✅ Cobro exitoso");
            // Recargar lista para quitar al que ya pagó
            cargarPendientes(); 
            setBusqueda(''); // Limpiar buscador
        } catch (error) {
            toast.error("Error al procesar pago");
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="text-success mb-4"><FaCashRegister/> Caja Central</h2>
            
            <Card className="shadow border-0">
                <Card.Header className="bg-white p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0 text-secondary">Cola de Pagos ({listaFiltrada.length})</h5>
                        <Button variant="outline-success" size="sm" onClick={cargarPendientes}>🔄 Actualizar</Button>
                    </div>

                    {/* BARRA DE BÚSQUEDA */}
                    <InputGroup size="lg">
                        <InputGroup.Text className="bg-success text-white"><FaSearch/></InputGroup.Text>
                        <Form.Control 
                            placeholder="Buscar por Nombre del Paciente..." 
                            value={busqueda}
                            onChange={handleBuscar}
                        />
                    </InputGroup>
                </Card.Header>

                <Card.Body className="p-0">
                    <Table hover responsive className="align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Paciente</th>
                                <th>Fecha Cita</th>
                                <th>Médico</th>
                                <th>Monto</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaFiltrada.map(cita => (
                                <tr key={cita.idCita}>
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-light rounded-circle p-2 me-3 text-secondary"><FaUserCircle size={20}/></div>
                                            <div>
                                                <div className="fw-bold">{cita.nombrePaciente}</div>
                                                <small className="text-muted">ID Cita: #{cita.idCita}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{cita.fechaCita} <br/><small className="text-muted">{cita.horaCita}</small></td>
                                    <td>{cita.infoMedico}</td>
                                    <td className="fw-bold text-success fs-5">S/ {cita.precio}</td>
                                    <td>
                                        <Button variant="success" onClick={() => handleCobrar(cita)}>
                                            Cobrar 💵
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {listaFiltrada.length === 0 && (
                                <tr><td colSpan="5" className="text-center p-5 text-muted">No se encontraron deudas pendientes.</td></tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CobrosPage;