package com.centromedico.ms_citas.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
public class CitaMedica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCita;

    private Long idPaciente;
    private String nombrePaciente;

    private Long idProgramacionHorario;
    private String infoMedico;
    private LocalDate fechaCita;
    private LocalTime horaCita;

    private LocalDateTime fechaRegistro;
    private String estado; // PROGRAMADO, CANCELADO, COMPLETADA
    private Double precio;

    private Long idEncargado;

}
