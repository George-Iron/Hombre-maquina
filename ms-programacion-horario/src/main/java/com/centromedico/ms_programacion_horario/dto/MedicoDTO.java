package com.centromedico.ms_programacion_horario.dto;

import lombok.Data;

@Data
public class MedicoDTO {

    private Long idEmpleado;
    private String nombre;
    private String apellido;
    private String especialidad;
    private String rol;

}
