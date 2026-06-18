package com.centromedico.ms_compuesto_farmacia.dto;

import lombok.Data;

@Data
public class DetalleDTO {
    private Long idDetalle;
    private Long idReceta;
    private Long idMedicamento;
    private Integer cantidad;
}
