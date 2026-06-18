package com.centromedico.ms_programacion_horario.service;

import com.centromedico.ms_programacion_horario.client.PersonalClient;
import com.centromedico.ms_programacion_horario.client.CitaClient;
import com.centromedico.ms_programacion_horario.client.FacturacionClient;
import com.centromedico.ms_programacion_horario.dto.MedicoDTO;
import com.centromedico.ms_programacion_horario.dto.CitaDTO;
import com.centromedico.ms_programacion_horario.dto.BoletaVentaDTO;
import com.centromedico.ms_programacion_horario.entity.Consultorio;
import com.centromedico.ms_programacion_horario.entity.ProgramacionHorario;
import com.centromedico.ms_programacion_horario.repository.ConsultorioRepository;
import com.centromedico.ms_programacion_horario.repository.ProgramacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicioProgramacion {

    @Autowired
    private ProgramacionRepository programacionRepository;
    @Autowired
    private ConsultorioRepository consultorioRepository;
    @Autowired
    private PersonalClient personalClient;
    @Autowired
    private CitaClient citaClient;
    @Autowired
    private FacturacionClient facturacionClient;

    public Consultorio registrarConsultorio(Consultorio consultorio) {
        return consultorioRepository.save(consultorio);
    }

    public List<Consultorio> listarConsultorios() {
        return consultorioRepository.findAll();
    }


    public ProgramacionHorario registrarHorario(ProgramacionHorario horario) {
        // 1. Validar Médico
        MedicoDTO medico = personalClient.buscarEmpleadoPorId(horario.getIdMedico()).getBody();
        if (medico == null || !"DOCTOR".equals(medico.getRol())) {
            throw new RuntimeException("El empleado no es un médico válido.");
        }

        horario.setNombreMedico(medico.getNombre() + " " + medico.getApellido());
        horario.setEspecialidadMedico(medico.getEspecialidad());

        // 2. Validar Consultorio
        Consultorio cons = consultorioRepository.findById(horario.getConsultorio().getIdConsultorio())
                .orElseThrow(() -> new RuntimeException("Consultorio no encontrado"));
        horario.setConsultorio(cons);

        if (programacionRepository.existsByIdMedicoAndFechaAndHoraInicio(
                horario.getIdMedico(), horario.getFecha(), horario.getHoraInicio())) {
            throw new RuntimeException("El médico ya tiene un turno asignado a esta hora.");
        }

        if (programacionRepository.existsByConsultorioIdConsultorioAndFechaAndHoraInicio(
                cons.getIdConsultorio(), horario.getFecha(), horario.getHoraInicio())) {
            throw new RuntimeException("El consultorio está ocupado a esta hora.");
        }

        // Asignar hora fin
        if (horario.getHoraFin() == null) {
            horario.setHoraFin(horario.getHoraInicio().plusMinutes(30));
        }

        horario.setDisponible(true);
        horario.setEstadoTurno("LIBRE");
        return programacionRepository.save(horario);
    }

    public List<ProgramacionHorario> listarHorariosDisponibles(String especialidad) {
        if (especialidad != null && !especialidad.isEmpty()) {
            return programacionRepository.findByEspecialidadMedicoAndDisponibleTrue(especialidad);
        }
        return programacionRepository.findByDisponibleTrue();
    }

    public ProgramacionHorario buscarHorarioPorId(Long id) {
        ProgramacionHorario horario = programacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));
        calcularEstadoTurno(horario);
        return horario;
    }

    public void actualizarEstado(Long id, boolean disponible) {
        ProgramacionHorario horario = programacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));
        horario.setDisponible(disponible);
        programacionRepository.save(horario);
    }

    public ProgramacionHorario actualizarHorario(Long id, ProgramacionHorario datos) {
        ProgramacionHorario actual = programacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));
        actual.setFecha(datos.getFecha());
        actual.setHoraInicio(datos.getHoraInicio());
        return programacionRepository.save(actual);
    }

    // CRUD: Eliminar
    public void eliminarHorario(Long id) {
        programacionRepository.deleteById(id);
    }

    public List<ProgramacionHorario> listarTodos() {
        List<ProgramacionHorario> horarios = programacionRepository.findAll();
        
        List<CitaDTO> citas = null;
        try {
            var response = citaClient.listarCitas();
            if (response != null) {
                citas = response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Error al listar citas en ServicioProgramacion: " + e.getMessage());
        }

        List<BoletaVentaDTO> boletas = null;
        try {
            var response = facturacionClient.listarBoletas();
            if (response != null) {
                boletas = response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Error al listar boletas en ServicioProgramacion: " + e.getMessage());
        }

        // Map appointments by schedule ID
        java.util.Map<Long, CitaDTO> citaMap = new java.util.HashMap<>();
        if (citas != null && !citas.isEmpty()) {
            for (CitaDTO cita : citas) {
                if (cita != null && cita.getIdProgramacionHorario() != null) {
                    citaMap.put(cita.getIdProgramacionHorario(), cita);
                }
            }
        }

        // Map boletas by appointment ID
        java.util.Set<Long> paidCitas = new java.util.HashSet<>();
        if (boletas != null && !boletas.isEmpty()) {
            for (BoletaVentaDTO boleta : boletas) {
                if (boleta != null && boleta.getIdCita() != null && 
                    ("PAGADA".equalsIgnoreCase(boleta.getEstado()) || "COMPLETA".equalsIgnoreCase(boleta.getEstado()))) {
                    paidCitas.add(boleta.getIdCita());
                }
            }
        }

        for (ProgramacionHorario horario : horarios) {
            if (horario == null) continue;
            CitaDTO cita = (citas == null || citas.isEmpty()) ? null : citaMap.get(horario.getIdProgramacion());
            if (cita == null) {
                horario.setEstadoTurno("LIBRE");
            } else {
                boolean esCitaPagada = "PAGADA".equalsIgnoreCase(cita.getEstado());
                boolean tieneBoletaPagada = paidCitas.contains(cita.getIdCita());
                if (esCitaPagada || tieneBoletaPagada) {
                    horario.setEstadoTurno("OCUPADO");
                } else {
                    horario.setEstadoTurno("PENDIENTE");
                }
            }
        }

        return horarios;
    }

    private void calcularEstadoTurno(ProgramacionHorario horario) {
        if (horario == null) return;
        
        List<CitaDTO> citas = null;
        try {
            var response = citaClient.listarCitas();
            if (response != null) {
                citas = response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Error al listar citas: " + e.getMessage());
        }

        if (citas == null || citas.isEmpty()) {
            horario.setEstadoTurno("LIBRE");
            return;
        }

        CitaDTO citaAsociada = null;
        for (CitaDTO cita : citas) {
            if (cita != null && horario.getIdProgramacion() != null && 
                horario.getIdProgramacion().equals(cita.getIdProgramacionHorario())) {
                citaAsociada = cita;
                break;
            }
        }

        if (citaAsociada == null) {
            horario.setEstadoTurno("LIBRE");
            return;
        }

        // 1. Si el estado de la cita asociada es estrictamente "PAGADA"
        boolean esCitaPagada = "PAGADA".equalsIgnoreCase(citaAsociada.getEstado());
        if (esCitaPagada) {
            horario.setEstadoTurno("OCUPADO");
            return;
        }

        // 2. Consultar FacturacionClient pasando el idCita específico
        boolean tieneBoletaPagada = false;
        try {
            var response = facturacionClient.buscarPorCita(citaAsociada.getIdCita());
            if (response != null && response.getBody() != null) {
                String estadoBoleta = response.getBody().getEstado();
                if ("PAGADA".equalsIgnoreCase(estadoBoleta) || "COMPLETA".equalsIgnoreCase(estadoBoleta)) {
                    tieneBoletaPagada = true;
                }
            }
        } catch (Exception e) {
            System.err.println("Cita no facturada o error al buscar boleta para cita " + citaAsociada.getIdCita() + ": " + e.getMessage());
        }

        if (tieneBoletaPagada) {
            horario.setEstadoTurno("OCUPADO");
        } else {
            horario.setEstadoTurno("PENDIENTE");
        }
    }
}