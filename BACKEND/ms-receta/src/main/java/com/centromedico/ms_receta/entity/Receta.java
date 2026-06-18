package com.centromedico.ms_receta.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Receta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReceta;

    private LocalDate fechaEmision;
    private String horaEmision;

    private String nombreSolicitante;

    private String indicaciones;
    private String duracion;
}
