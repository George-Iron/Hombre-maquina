package com.centromedico.ms_facturacion.dto;

import lombok.Data;

@Data
public class CitaDTO {

    private Long idCita;
    private Long idPaciente;
    private String nombrePaciente;
    private Double precio;
    private String estado;

}
