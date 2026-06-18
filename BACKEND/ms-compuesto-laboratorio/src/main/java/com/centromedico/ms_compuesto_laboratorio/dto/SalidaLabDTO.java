package com.centromedico.ms_compuesto_laboratorio.dto;

import lombok.Data;

@Data
public class SalidaLabDTO {
    private Long idDetalle;
    private Long idTipoAnalisis;

    private Long idFichaAna;
    private String solicitante;
    private String fecha;
    private String hora;
    private String observaciones;
    private String resultado;
}
