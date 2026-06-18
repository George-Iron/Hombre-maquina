package com.centromedico.ms_analisis.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Analisis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAnalisis;

    private LocalDate fecha;
    private String hora;
    private String solicitante;

    private String observaciones;
    private String resultado;

    private String estado;
}
