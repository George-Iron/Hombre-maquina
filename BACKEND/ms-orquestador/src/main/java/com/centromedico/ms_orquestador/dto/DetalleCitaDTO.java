package com.centromedico.ms_orquestador.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DetalleCitaDTO {

    private Long idCita;
    private String fechaRegistro;
    private String estado;

    private Long idEncargado;
    private String nombreEncargado;
    private String rolEncargado;

}
