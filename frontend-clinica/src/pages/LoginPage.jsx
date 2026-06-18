import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import api from '../config/axios'; // Importamos nuestra instancia de Axios configurada
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

const LoginPage = () => {
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 1. LLAMADA AL BACKEND REAL
            // El Gateway redirige /security/loginAsistente a Seguridad-Server
            const response = await api.post('/security/loginAsistente', {
                dni: dni,
                password: password
            });

            // 2. SI HAY ÉXITO
            const token = response.data.token;
            login(token); // Guardamos el token en el contexto
            navigate('/'); // Nos vamos al dashboard

        } catch (err) {
            // 3. SI HAY ERROR (401, 500, etc)
            if (err.response && err.response.status === 401) {
                setError('Credenciales incorrectas. Intente de nuevo.');
            } else {
                setError('Error de conexión con el servidor.');
                console.error(err);
            }
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '400px' }} className="shadow p-4">
                <Card.Body>
                    <h2 className="text-center mb-4 text-primary">Centro Médico</h2>
                    <h5 className="text-center mb-4 text-secondary">Iniciar Sesión</h5>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>DNI</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese su DNI"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">
                                Ingresar
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LoginPage;