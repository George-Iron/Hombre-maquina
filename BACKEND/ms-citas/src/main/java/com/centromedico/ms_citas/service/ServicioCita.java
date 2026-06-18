package com.centromedico.ms_citas.service;

import com.centromedico.ms_citas.client.PacienteClient;
import com.centromedico.ms_citas.client.ProgramacionClient;
import com.centromedico.ms_citas.dto.PacienteDTO;
import com.centromedico.ms_citas.dto.ProgramacionHorarioDTO;
import com.centromedico.ms_citas.entity.CitaMedica;
import com.centromedico.ms_citas.repository.CitaRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class ServicioCita {

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private PacienteClient pacienteClient;

    @Autowired
    private ProgramacionClient programacionClient;

    @Transactional
    @CircuitBreaker(name = "citasCB", fallbackMethod = "fallbackRegistrarCita")
    public CitaMedica registrarCita(String dniPaciente, Long idHorario, Long idEncargado) {

        // 1. Validaciones
        PacienteDTO paciente = pacienteClient.buscarPorDni(dniPaciente).getBody();
        if (paciente == null) throw new RuntimeException("Paciente no encontrado");

        ProgramacionHorarioDTO horario = programacionClient.buscarHorario(idHorario).getBody();
        if (horario == null || !horario.isDisponible()) throw new RuntimeException("Horario no disponible");

        // 2. Crear Cita
        CitaMedica cita = new CitaMedica();
        cita.setIdPaciente(paciente.getIdPaciente());
        cita.setNombrePaciente(paciente.getNombre());
        cita.setIdProgramacionHorario(horario.getIdProgramacion());
        cita.setInfoMedico(horario.getNombreMedico() + " - " + horario.getEspecialidadMedico());
        cita.setFechaCita(horario.getFecha());
        cita.setHoraCita(LocalTime.parse(horario.getHoraInicio().toString()));
        cita.setFechaRegistro(LocalDateTime.now());
        cita.setEstado("PENDIENTE_PAGO");
        cita.setPrecio(50.00);
        cita.setIdEncargado(idEncargado != null ? idEncargado : 1L);

        CitaMedica citaGuardada = citaRepository.save(cita);

        programacionClient.actualizarEstado(idHorario, false);

        return citaGuardada;
    }

    public CitaMedica fallbackRegistrarCita(String dniPaciente, Long idHorario, Long idEncargado, Throwable t) {
        throw new RuntimeException("Servicios externos no disponibles temporalmente. Por favor, intente en unos minutos. Detalle: " + t.getMessage());
    }

    public void actualizarEstadoCita(Long idCita, String nuevoEstado) {
        CitaMedica cita = citaRepository.findById(idCita)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
        cita.setEstado(nuevoEstado);
        citaRepository.save(cita);
    }

    public List<CitaMedica> listarCitas() {
        return citaRepository.findAll();
    }

    public Optional<CitaMedica> buscarCitaPorId(Long id) {
        return citaRepository.findById(id);
    }

    public List<CitaMedica> listarCitasPorFecha(LocalDate fecha) {
        return citaRepository.findByFechaCita(fecha);
    }

    // CRUD: Eliminar
    public void eliminarCita(Long id) {
        CitaMedica cita = buscarCitaPorId(id).orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        try {
            programacionClient.actualizarEstado(cita.getIdProgramacionHorario(), true);
        } catch (Exception e) {
            System.err.println("No se pudo liberar el horario: " + e.getMessage());
        }

        citaRepository.deleteById(id);
    }

    public List<CitaMedica> listarCitasPorEstado(String estado) {
        return citaRepository.findByEstado(estado);
    }
}