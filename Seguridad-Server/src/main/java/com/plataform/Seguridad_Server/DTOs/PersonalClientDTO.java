package com.plataform.Seguridad_Server.DTOs;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PersonalClientDTO {
    @JsonProperty("nombre")
    private String nombre;
    @JsonProperty("apellido")
    private String apellido;
    @JsonProperty("dni")
    private String dni;
    @JsonProperty("correo")
    private String correo;
    @JsonProperty("contraseña")
    private Boolean contraseña;
    @JsonProperty("isEnable")
    private Boolean habilitado;
    @JsonProperty("rol")
    private String rol;

    public String getNombre() {return nombre;}
    public void setNombre(String nombre) {this.nombre = nombre;}

    public String getApellido() {return apellido;}
    public void setApellido(String apellido) {this.apellido = apellido;}

    public String getDni() {return dni;}
    public void setDni(String dni) {this.dni = dni;}

    public String getCorreo() {return correo;}
    public void setCorreo(String correo) {this.correo = correo;}

    public Boolean getContraseña() {return contraseña;}
    public void setContraseña(Boolean contraseña) {this.contraseña = contraseña;}

    public Boolean getHabilitado() {return habilitado;}
    public void setHabilitado(Boolean habilitado) {this.habilitado = habilitado;}

    public String getRol() {return rol;}
    public void setRol(String rol) {this.rol = rol;}
}
