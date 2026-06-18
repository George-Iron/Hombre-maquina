package com.centromedico.ms_compuesto_laboratorio.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

@Data
public class AnalisisDTO {
    private Long idAnalisis;
    private String solicitante;
    private String observaciones;
    private String resultado;

    @JsonAlias({"fecha", "fechaCreacion"})
    private String fecha;

    @JsonAlias({"hora", "horaCreacion"})
    private String hora;
}