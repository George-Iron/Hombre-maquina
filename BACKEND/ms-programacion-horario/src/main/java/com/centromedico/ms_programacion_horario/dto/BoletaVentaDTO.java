package com.centromedico.ms_programacion_horario.dto;

import lombok.Data;

@Data
public class BoletaVentaDTO {
    private Long idBoleta;
    private Long idCita;
    private String estado;
}
