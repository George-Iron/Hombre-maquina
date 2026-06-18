package com.plataform.Seguridad_Server.DTOs;

public class PersonalRegisterResponseDTO {
    private String dni;
    private String email;
    private String password;
    private String rol;
    private Boolean active;

    public PersonalRegisterResponseDTO() {}
    public PersonalRegisterResponseDTO(String dni, String email, String password,String rol, Boolean active) {
        this.dni = dni;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.active = active;
    }

    public String getDni() {return dni;}
    public void setDni(String dni) {this.dni = dni;}

    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {return rol;}
    public void setRol(String rol) {this.rol = rol;}

    public Boolean getActive() {return active;}
    public void setActive(Boolean active) {this.active = active;}
}
