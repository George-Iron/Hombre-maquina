package com.centromedico.ms_compuesto_laboratorio.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrdenLabDTO {
    private String solicitante;
    private String observaciones;
    private List<Long> tiposAnalisisIds;
}
