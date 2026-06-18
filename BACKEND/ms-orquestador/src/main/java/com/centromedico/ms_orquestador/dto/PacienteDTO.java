package com.centromedico.ms_orquestador.dto;

import lombok.Data;

@Data
public class PacienteDTO {

    private Long idPaciente;
    private String documento;
    private String nombre;
    private String fechaNac;
    private String telefono;

}
