package com.centromedico.ms_programacion_horario.service;

import com.centromedico.ms_programacion_horario.client.PersonalClient;
import com.centromedico.ms_programacion_horario.dto.MedicoDTO;
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
        return programacionRepository.save(horario);
    }

    public List<ProgramacionHorario> listarHorariosDisponibles(String especialidad) {
        if (especialidad != null && !especialidad.isEmpty()) {
            return programacionRepository.findByEspecialidadMedicoAndDisponibleTrue(especialidad);
        }
        return programacionRepository.findByDisponibleTrue();
    }

    public ProgramacionHorario buscarHorarioPorId(Long id) {
        return programacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));
    }

    public void actualizarEstado(Long id, boolean disponible) {
        ProgramacionHorario horario = buscarHorarioPorId(id);
        horario.setDisponible(disponible);
        programacionRepository.save(horario);
    }

    public ProgramacionHorario actualizarHorario(Long id, ProgramacionHorario datos) {
        ProgramacionHorario actual = buscarHorarioPorId(id);
        actual.setFecha(datos.getFecha());
        actual.setHoraInicio(datos.getHoraInicio());
        return programacionRepository.save(actual);
    }

    // CRUD: Eliminar
    public void eliminarHorario(Long id) {
        programacionRepository.deleteById(id);
    }
}