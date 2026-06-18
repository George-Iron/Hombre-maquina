package com.centromedico.ms_programacion_horario.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
public class ProgramacionHorario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProgramacion;

    private Long idMedico;
    private String nombreMedico;
    private String especialidadMedico;

    @ManyToOne
    @JoinColumn(name = "id_consultorio")
    private Consultorio consultorio;

    private LocalDate fecha;
    private String turno;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private boolean disponible;


    public ProgramacionHorario() {}

    public ProgramacionHorario(Long idProgramacion, Long idMedico, String nombreMedico, String especialidadMedico, Consultorio consultorio, LocalDate fecha, String turno, LocalTime horaInicio, LocalTime horaFin, boolean disponible) {
        this.idProgramacion = idProgramacion;
        this.idMedico = idMedico;
        this.nombreMedico = nombreMedico;
        this.especialidadMedico = especialidadMedico;
        this.consultorio = consultorio;
        this.fecha = fecha;
        this.turno = turno;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.disponible = disponible;
    }

    public Long getIdProgramacion() {
        return idProgramacion;
    }

    public void setIdProgramacion(Long idProgramacion) {
        this.idProgramacion = idProgramacion;
    }

    public Long getIdMedico() {
        return idMedico;
    }

    public void setIdMedico(Long idMedico) {
        this.idMedico = idMedico;
    }

    public String getNombreMedico() {
        return nombreMedico;
    }

    public void setNombreMedico(String nombreMedico) {
        this.nombreMedico = nombreMedico;
    }

    public String getEspecialidadMedico() {
        return especialidadMedico;
    }

    public void setEspecialidadMedico(String especialidadMedico) {
        this.especialidadMedico = especialidadMedico;
    }

    public Consultorio getConsultorio() {
        return consultorio;
    }

    public void setConsultorio(Consultorio consultorio) {
        this.consultorio = consultorio;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public boolean isDisponible() {
        return disponible;
    }

    public void setDisponible(boolean disponible) {
        this.disponible = disponible;
    }
}
