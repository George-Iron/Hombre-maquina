package com.centromedico.ms_paciente.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Paciente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPaciente;
    private String documento;
    private String nombre;
    private String apellido;
    private String fechaNac;
    private String telefono;

    public Paciente() {}
    public Paciente(Long idPaciente, String documento, String nombre,String apellido, String fechaNac, String telefono) {
        this.idPaciente = idPaciente;
        this.documento = documento;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNac = fechaNac;
        this.telefono = telefono;
    }

    public Long getIdPaciente() {return idPaciente;}
    public void setIdPaciente(Long idPaciente) {this.idPaciente = idPaciente;}

    public String getDocumento() {return documento;}
    public void setDocumento(String documento) {this.documento = documento;}

    public String getNombre() {return nombre;}
    public void setNombre(String nombre) {this.nombre = nombre;}

    public String getApellido() {return apellido;}
    public void setApellido(String apellido) {this.apellido = apellido;}

    public String getFechaNac() {return fechaNac;}
    public void setFechaNac(String fechaNac) {this.fechaNac = fechaNac;}

    public String getTelefono() {return telefono;}
    public void setTelefono(String telefono) {this.telefono = telefono;}
}
