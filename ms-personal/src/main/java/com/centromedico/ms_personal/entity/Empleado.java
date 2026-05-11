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

    @Column(unique = true, nullable = false)//el dni debe ser unico
    private String dni;

    //datos de autentificacion
    @Column(nullable = false)
    private String contraseña;

    private boolean isEnable = true;

    @Enumerated(EnumType.STRING) //guarda el rol como texto
    private Rol rol;

    private String especialidad; //aplica si el rol es doctor

}
