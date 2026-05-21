package com.plataform.Seguridad_Server.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "auth_auth")
public class AuthPersonalModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAuth;
    @Column(nullable = false)
    private String dniAuth;
    @Column(nullable = false)
    private String correoAuth;
    @Column(nullable = false)
    private String contraseñaAuth;
    @Column(nullable = false)
    private String rolAuth;
    @Column(nullable = false)
    private Boolean habilitadoAuth;

    public AuthPersonalModel() {}
    public AuthPersonalModel(Long idAuth, String dniAuth, String correoAuth, String contraseñaAuth, String rolAuth, Boolean habilitadoAuth) {
        this.idAuth = idAuth;
        this.dniAuth = dniAuth;
        this.correoAuth = correoAuth;
        this.contraseñaAuth = contraseñaAuth;
        this.rolAuth = rolAuth;
        this.habilitadoAuth = habilitadoAuth;
    }

    public Long getIdAuth() {
        return idAuth;
    }

    public void setIdAuth(Long idAuth) {
        this.idAuth = idAuth;
    }

    public String getDniAuth() {
        return dniAuth;
    }

    public void setDniAuth(String dniAuth) {
        this.dniAuth = dniAuth;
    }

    public String getCorreoAuth() {
        return correoAuth;
    }

    public void setCorreoAuth(String correoAuth) {
        this.correoAuth = correoAuth;
    }

    public String getContraseñaAuth() {
        return contraseñaAuth;
    }

    public void setContraseñaAuth(String contraseñaAuth) {
        this.contraseñaAuth = contraseñaAuth;
    }

    public String getRolAuth() {
        return rolAuth;
    }

    public void setRolAuth(String rolAuth) {
        this.rolAuth = rolAuth;
    }

    public Boolean getHabilitadoAuth() {
        return habilitadoAuth;
    }

    public void setHabilitadoAuth(Boolean habilitadoAuth) {
        this.habilitadoAuth = habilitadoAuth;
    }
}
