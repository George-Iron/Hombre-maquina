package com.centromedico.ms_programacion_horario.dto;

import lombok.Data;

@Data
public class CitaDTO {
    private Long idCita;
    private Long idPaciente;
    private String nombrePaciente;
    private Long idProgramacionHorario;
    private String estado;
    private Double precio;
}
