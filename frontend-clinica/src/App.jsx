import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';

// Páginas Generales
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// Páginas de Doctor
import AgendaDoctor from './pages/doctor/AgendaDoctor'; 
import AtencionMedica from './pages/doctor/AtencionMedica';

// Páginas de Admin
import AdminDashboard from './pages/admin/AdminDashboard'; 
import GestionPersonal from './pages/admin/GestionPersonal';
import GestionFarmacia from './pages/admin/GestionFarmacia';
import GestionLaboratorio from './pages/admin/GestionLaboratorio';
import GestionProgramacion from './pages/admin/GestionProgramacion';

// Páginas de Enfermería (Nuevo)
import TriajePage from './pages/enfermeria/TriajePage';

// Páginas de Recepción y Caja
import AgendarCitaPage from './pages/recepcion/AgendarCitaPage';
import CobrosPage from './pages/caja/CobrosPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 1. PÁGINAS PÚBLICAS (Sin Layout) */}
          <Route path="/login" element={<LoginPage />} />

          {/* 2. PÁGINAS PROTEGIDAS (Todas requieren estar logueado) */}
          <Route element={<ProtectedRoute />}>
            
            {/* 3. LAYOUT (Envuelve a todas las páginas internas) */}
            <Route element={<Layout />}>
                
                {/* Dashboard General (Accesible para todos los logueados) */}
                <Route path="/" element={<DashboardPage />} />

                {/* Acceso no autorizado */}
                <Route path="/unauthorized" element={
                    <div className="text-center p-5 mt-5">
                        <h2 className="text-danger fw-bold">⚠️ Acceso No Autorizado</h2>
                        <p className="text-secondary mt-2">Tu rol no cuenta con los permisos necesarios para ver esta sección.</p>
                        <a href="/" className="btn btn-primary mt-3">Volver al Inicio</a>
                    </div>
                } />

                {/* ZONA ADMIN (Exclusiva para ADMIN) */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}> 
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/personal" element={<GestionPersonal />} />
                    <Route path="/admin/farmacia" element={<GestionFarmacia />} />
                    <Route path="/admin/laboratorio" element={<GestionLaboratorio />} />
                    <Route path="/admin/programacion" element={<GestionProgramacion />} />
                </Route>

                {/* ZONA MÉDICA (Doctores + ADMIN) */}
                <Route element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']} />}> 
                    <Route path="/medico/agenda" element={<AgendaDoctor />} />
                    <Route path="/medico/atencion/:idCita" element={<AtencionMedica />} />
                </Route>

                {/* ZONA ENFERMERÍA (Enfermeras + ADMIN) */}
                <Route element={<ProtectedRoute allowedRoles={['ENFERMERA', 'ADMIN']} />}>
                    <Route path="/enfermeria/triaje" element={<TriajePage />} />
                </Route>

                {/* ZONA CAJA (Cajeros + ADMIN) */}
                <Route element={<ProtectedRoute allowedRoles={['CAJERO', 'ADMIN']} />}>
                    <Route path="/caja/cobros" element={<CobrosPage />} />
                </Route>

                {/* ZONA RECEPCIÓN (Recepcionistas + ADMIN) */}
                <Route element={<ProtectedRoute allowedRoles={['RECEPCIONISTA', 'ADMIN']} />}>
                    <Route path="/recepcion/citas" element={<AgendarCitaPage />} />
                </Route>

            </Route> {/* Fin del Layout */}
          
          </Route> {/* Fin del ProtectedRoute General */}

        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;