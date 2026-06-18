package com.centromedico.ms_citas.dto;

import lombok.Data;

@Data
public class CitaRequestDTO {
    private String dniPaciente;
    private Long idHorario;
    private Long idEncargado;
}
