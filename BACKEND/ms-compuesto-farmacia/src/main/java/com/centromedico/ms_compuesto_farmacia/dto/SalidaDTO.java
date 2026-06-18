package com.centromedico.ms_compuesto_farmacia.dto;

import lombok.Data;

@Data
public class SalidaDTO {
    private Long idDetalle;
    private Long idMedicamento;

    private Long idReceta;
    private String nombreSolicitante;
    private String fecha;
    private String hora;
    private String indicaciones;
    private String duracion;
}