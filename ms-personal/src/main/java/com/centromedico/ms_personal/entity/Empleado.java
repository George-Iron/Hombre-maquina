package com.centromedico.ms_personal.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEmpleado;
    private String nombre;
    private String apellido;

    @Column(unique = true, nullable = false)
    private String dni;

    @Column(nullable = false)
    private String contraseña;

    private boolean isEnable = true;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    private String especialidad;

}
