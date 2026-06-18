package com.centromedico.ms_personal.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "medico")
public class Medico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMedico;
    @OneToOne
    @JoinColumn(name = "empleado_id", nullable = false, unique = true)
    private Empleado empleado;
    @Column( nullable = false)
    private String codigo;
    @Column( nullable = false)
    private Especialidad especialidad;

    public Medico() {}
    public Medico(Long idMedico, Empleado empleado,String codigo, Especialidad especialidad) {
        this.idMedico = idMedico;
        this.empleado = empleado;
        this.codigo = codigo;
        this.especialidad = especialidad;
    }

    public Long getIdMedico() {return idMedico;}
    public void setIdMedico(Long idMedico) {this.idMedico = idMedico;}

    public Empleado getEmpleado() {return empleado;}
    public void setEmpleado(Empleado empleado) {this.empleado = empleado;}

    public String getCodigo() {return codigo;}
    public void setCodigo(String codigo) {this.codigo = codigo;}

    public Especialidad getEspecialidad() {return especialidad;}
    public void setEspecialidad(Especialidad especialidad) {this.especialidad = especialidad;}
}
