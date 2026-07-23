import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import api from '../config/axios';

const LoginPage = () => {
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [touched, setTouched] = useState({ dni: false, password: false });

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Validaciones lógicas
    const isDniValid = /^\d{8}$/.test(dni);
    const isPasswordValid = password.length >= 4;
    const isFormValid = isDniValid && isPasswordValid;

    const handleDniChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 8);
        setDni(val);
        setError('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
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
                setError('Credenciales de acceso no válidas para el DNI ingresado.');
            } else {
                setError('Error de conexión con el servidor de autenticación.');
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
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                minHeight: '100vh',
                width: '100%',
                maxWidth: '960px',
                margin: '0 auto',
            }}>
                {/* Branding Left */}
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

                {/* Form Right */}
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
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
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
                                    inputMode="numeric"
                                    maxLength={8}
                                    placeholder="Ingrese DNI (8 dígitos)"
                                    value={dni}
                                    onChange={handleDniChange}
                                    onBlur={() => setTouched(prev => ({ ...prev, dni: true }))}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '0.875rem',
                                        color: 'var(--text-primary)',
                                        backgroundColor: 'var(--surface-card)',
                                        border: touched.dni && !isDniValid
                                            ? '1px solid var(--semantic-danger)'
                                            : '1px solid var(--border-default)',
                                        borderRadius: 'var(--radius-md)',
                                        outline: 'none',
                                        transition: 'border-color 180ms ease, box-shadow 180ms ease',
                                    }}
                                />
                                {touched.dni && !isDniValid && (
                                    <span style={{
                                        display: 'block',
                                        color: 'var(--semantic-danger)',
                                        fontSize: '0.75rem',
                                        marginTop: '4px'
                                    }}>
                                        El DNI debe contener exactamente 8 dígitos numéricos.
                                    </span>
                                )}
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
                                    onChange={handlePasswordChange}
                                    onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        fontFamily: 'var(--font-sans)',
                                        fontSize: '0.875rem',
                                        color: 'var(--text-primary)',
                                        backgroundColor: 'var(--surface-card)',
                                        border: touched.password && !isPasswordValid
                                            ? '1px solid var(--semantic-danger)'
                                            : '1px solid var(--border-default)',
                                        borderRadius: 'var(--radius-md)',
                                        outline: 'none',
                                        transition: 'border-color 180ms ease, box-shadow 180ms ease',
                                    }}
                                />
                                {touched.password && !isPasswordValid && (
                                    <span style={{
                                        display: 'block',
                                        color: 'var(--semantic-danger)',
                                        fontSize: '0.75rem',
                                        marginTop: '4px'
                                    }}>
                                        La contraseña debe tener al menos 4 caracteres.
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!isFormValid}
                                style={{
                                    width: '100%',
                                    padding: '12px 20px',
                                    backgroundColor: isFormValid ? 'var(--accent)' : 'var(--surface-inset)',
                                    color: isFormValid ? 'var(--text-inverse)' : 'var(--text-tertiary)',
                                    border: isFormValid ? 'none' : '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-md)',
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: '0.9375rem',
                                    fontWeight: 500,
                                    cursor: isFormValid ? 'pointer' : 'not-allowed',
                                    transition: 'all 180ms ease',
                                    opacity: isFormValid ? 1 : 0.75,
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