import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import api from '../config/axios';

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
            const response = await api.post('/security/loginAsistente', {
                dni: dni,
                password: password
            });

            const token = response.data.token;
            login(token);
            navigate('/');

        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Credenciales incorrectas. Intente de nuevo.');
            } else {
                setError('Error de conexión con el servidor.');
                console.error(err);
            }
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'grid',
            gridTemplateColumns: '1fr',
            backgroundColor: 'var(--surface-ground)',
            overflow: 'auto',
        }}>
            {/* Mobile: single column. Desktop: two columns */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                minHeight: '100vh',
                width: '100%',
                maxWidth: '960px',
                margin: '0 auto',
            }}>
                {/* Left: Branding */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: 'var(--space-2xl)',
                }}>
                    <h1 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '2.25rem',
                        color: 'var(--text-primary)',
                        marginBottom: 'var(--space-md)',
                        lineHeight: 1.15,
                    }}>
                        Centro Médico
                    </h1>
                    <p style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '1rem',
                        lineHeight: 1.6,
                        maxWidth: '360px',
                    }}>
                        Sistema integral de gestión clínica. Acceda con sus credenciales institucionales.
                    </p>
                </div>

                {/* Right: Form */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: 'var(--space-2xl)',
                }}>
                    <div style={{
                        background: 'var(--surface-card)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-xl)',
                        maxWidth: '400px',
                        width: '100%',
                    }}>
                        <h3 style={{
                            fontFamily: 'var(--font-serif)',
                            marginBottom: 'var(--space-xl)',
                            color: 'var(--text-primary)',
                        }}>
                            Iniciar Sesión
                        </h3>

                        {error && (
                            <div style={{
                                background: 'var(--semantic-danger-subtle)',
                                color: 'var(--semantic-danger)',
                                padding: 'var(--space-md)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.875rem',
                                marginBottom: 'var(--space-lg)',
                                border: '1px solid var(--semantic-danger)',
                                borderColor: 'rgba(160,83,75,0.2)',
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 'var(--space-lg)' }}>
                                <label
                                    htmlFor="login-dni"
                                    style={{
                                        display: 'block',
                                        fontSize: '0.8125rem',
                                        fontWeight: 500,
                                        color: 'var(--text-primary)',
                                        marginBottom: 'var(--space-xs)',
                                    }}
                                >
                                    DNI
                                </label>
                                <input
                                    id="login-dni"
                                    type="text"
                                    placeholder="Ingrese su DNI"
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '0.875rem',
                                        color: 'var(--text-primary)',
                                        backgroundColor: 'var(--surface-card)',
                                        border: '1px solid var(--border-default)',
                                        borderRadius: 'var(--radius-md)',
                                        outline: 'none',
                                        transition: 'border-color 180ms ease, box-shadow 180ms ease',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--accent)';
                                        e.target.style.boxShadow = '0 0 0 3px var(--accent-subtle)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--border-default)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: 'var(--space-xl)' }}>
                                <label
                                    htmlFor="login-password"
                                    style={{
                                        display: 'block',
                                        fontSize: '0.8125rem',
                                        fontWeight: 500,
                                        color: 'var(--text-primary)',
                                        marginBottom: 'var(--space-xs)',
                                    }}
                                >
                                    Contraseña
                                </label>
                                <input
                                    id="login-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '0.875rem',
                                        color: 'var(--text-primary)',
                                        backgroundColor: 'var(--surface-card)',
                                        border: '1px solid var(--border-default)',
                                        borderRadius: 'var(--radius-md)',
                                        outline: 'none',
                                        transition: 'border-color 180ms ease, box-shadow 180ms ease',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--accent)';
                                        e.target.style.boxShadow = '0 0 0 3px var(--accent-subtle)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--border-default)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '12px 20px',
                                    backgroundColor: 'var(--accent)',
                                    color: 'var(--text-inverse)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: '0.9375rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 180ms ease',
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = 'var(--accent-hover)';
                                    e.target.style.transform = 'translateY(-1px)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = 'var(--accent)';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                Ingresar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;