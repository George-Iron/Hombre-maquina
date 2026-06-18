package com.centromedico.ms_citas.dto;

import lombok.Data;

@Data
public class PacienteDTO {

    private Long idPaciente;
    private String documento;
    private String nombre;

}
