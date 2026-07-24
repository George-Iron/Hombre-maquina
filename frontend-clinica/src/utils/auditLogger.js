// Helper de Bitácora de Auditoría para el Sistema Clínico

const AUDIT_STORAGE_KEY = 'clinica_audit_logs';

// Logs semilla por defecto para demostración
const INITIAL_LOGS = [
    { id: 1, fecha: new Date(Date.now() - 3600000).toLocaleString('es-PE'), usuario: 'Admin General', rol: 'ADMIN', accion: 'ACTUALIZACIÓN', modulo: 'Farmacia', detalle: 'Ajustó stock de Paracetamol (+50 unidades)' },
    { id: 2, fecha: new Date(Date.now() - 7200000).toLocaleString('es-PE'), usuario: 'María Recepción', rol: 'RECEPCIONISTA', accion: 'REGISTRO', modulo: 'Pacientes', detalle: 'Registró nuevo paciente DNI 72819234' },
    { id: 3, fecha: new Date(Date.now() - 10800000).toLocaleString('es-PE'), usuario: 'Juan Cajero', rol: 'CAJERO', accion: 'COBRO', modulo: 'Caja', detalle: 'Procesó cobro de Cita #4 (S/ 50.00)' },
    { id: 4, fecha: new Date(Date.now() - 14400000).toLocaleString('es-PE'), usuario: 'Dr. Carlos Med', rol: 'DOCTOR', accion: 'ATENCIÓN', modulo: 'Historia Clínica', detalle: 'Finalizó atención médica y emitió receta para Cita #2' }
];

export const getAuditLogs = () => {
    try {
        const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_LOGS));
            return INITIAL_LOGS;
        }
        return JSON.parse(stored);
    } catch (e) {
        console.error("Error al leer logs de auditoría:", e);
        return INITIAL_LOGS;
    }
};

export const logAuditAction = ({ usuario = 'Usuario', rol = 'SISTEMA', accion = 'ACCION', modulo = 'General', detalle = '' }) => {
    try {
        const logs = getAuditLogs();
        const newLog = {
            id: Date.now(),
            fecha: new Date().toLocaleString('es-PE'),
            usuario,
            rol,
            accion,
            modulo,
            detalle
        };
        const updatedLogs = [newLog, ...logs];
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedLogs.slice(0, 100))); // Guardar últimos 100
        return newLog;
    } catch (e) {
        console.error("Error al registrar auditoría:", e);
    }
};

export const clearAuditLogs = () => {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([]));
};
