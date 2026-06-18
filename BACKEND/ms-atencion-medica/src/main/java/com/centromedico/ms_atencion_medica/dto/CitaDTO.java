package com.centromedico.ms_atencion_medica.dto;

import lombok.Data;

@Data
public class CitaDTO {

    private Long idCita;
    private Long idPaciente;
    private String estado; // para ver si pago o no

}
