package com.centromedico.ms_programacion_horario.repository;

import com.centromedico.ms_programacion_horario.entity.ProgramacionHorario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ProgramacionRepository extends JpaRepository<ProgramacionHorario, Long> {

    // 1. Validar que el MEDICO no tenga turno a esa hora
    boolean existsByIdMedicoAndFechaAndHoraInicio(Long idMedico, LocalDate fecha, LocalTime horaInicio);

    // 2. Validar que el CONSULTORIO no esté ocupado a esa hora
    boolean existsByConsultorioIdConsultorioAndFechaAndHoraInicio(Long idConsultorio, LocalDate fecha, LocalTime horaInicio);

    // 3. Buscar disponibles por especialidad
    List<ProgramacionHorario> findByEspecialidadMedicoAndDisponibleTrue(String especialidad);

    // 4. Listar todos los disponibles
    List<ProgramacionHorario> findByDisponibleTrue();

}
