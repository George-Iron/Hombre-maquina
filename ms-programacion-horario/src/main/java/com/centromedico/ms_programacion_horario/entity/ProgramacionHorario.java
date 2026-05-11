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

}
