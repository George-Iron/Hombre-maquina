package com.centromedico.ms_orquestador.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.time.LocalDate;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DetalleFacturacionDTO {

    private Long idBoleta;
    private Double montoTotal;
    private LocalDate fechaEmision;

    private Long idCajero;
    private String nombreCajero;

}
