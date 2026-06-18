package com.centromedico.ms_compuesto_farmacia.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

@Data
public class RecetaDTO {
    private Long idReceta;
    private String nombreSolicitante;

    private String indicaciones;
    private String duracion;

    @JsonAlias("horaEmision")
    private String hora;

    @JsonAlias("fechaEmision")
    private String fecha;
}
