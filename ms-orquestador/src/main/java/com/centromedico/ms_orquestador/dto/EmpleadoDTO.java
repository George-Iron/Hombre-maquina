package com.centromedico.ms_orquestador.dto;

import lombok.Data;

@Data
public class EmpleadoDTO {

    private Long idEmpleado;
    private String nombre;
    private String apellido;
    private String rol;

}
