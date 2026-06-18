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
    @Column(unique = true, nullable = false)
    private String correo;
    private boolean isEnable = true;
    @Column(nullable = false)
    private String contraseña;
    @Enumerated(jakarta.persistence.EnumType.STRING)
    private Rol rol;
    
    private String especialidad;

    public Empleado() {}
    public Empleado(Long idEmpleado, String nombre, String apellido, String dni,String correo, String contraseña, boolean isEnable, Rol rol) {
        this.idEmpleado = idEmpleado;
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.correo=correo;
        this.contraseña = contraseña;
        this.isEnable = isEnable;
        this.rol = rol;
    }

    public Long getIdEmpleado() {return idEmpleado;}
    public void setIdEmpleado(Long idEmpleado) {this.idEmpleado = idEmpleado;}

    public String getNombre() {return nombre;}
    public void setNombre(String nombre) {this.nombre = nombre;}

    public String getApellido() {return apellido;}
    public void setApellido(String apellido) {this.apellido = apellido;}

    public String getDni() {return dni;}
    public void setDni(String dni) {this.dni = dni;}

    public String getCorreo() {return correo;}
    public void setCorreo(String correo) {this.correo = correo;}

    public String getContraseña() {return contraseña;}
    public void setContraseña(String contraseña) {this.contraseña = contraseña;}

    public boolean isEnable() {return isEnable;}
    public void setEnable(boolean enable) {isEnable = enable;}

    public Rol getRol() {return rol;}
    public void setRol(Rol rol) {this.rol = rol;}
}
