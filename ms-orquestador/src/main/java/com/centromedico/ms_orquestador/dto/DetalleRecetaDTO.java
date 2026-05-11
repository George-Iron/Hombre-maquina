package com.centromedico.ms_orquestador.dto;

import lombok.Data;

@Data
public class DetalleRecetaDTO {

    private Long idDetalleReceta;
    private Long idMedicamento;
    private String nombreMedicamento;
    private String dosis;

}
