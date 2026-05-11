package com.centromedico.ms_orquestador.dto;

import lombok.Data;

@Data
public class DetalleAnalisisDTO {

    private Long idDetalleAnalisis;
    private Long idTipoAnalisis;
    private String nombreAnalisis;
    private String indicaciones;

}
