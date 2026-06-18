package com.centromedico.ms_compuesto_farmacia.dto;

import lombok.Data;

import java.util.List;

@Data
public class CompraDTO {
    private String solicitante;
    private String indicaciones;
    private String duracion;

    private List<Long> medicamentosIds;
}
