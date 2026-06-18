package com.centromedico.ms_citas.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ProgramacionHorarioDTO {

    private Long idProgramacion;
    private Long idMedico;
    private String nombreMedico;
    private String especialidadMedico;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private boolean disponible;

}
