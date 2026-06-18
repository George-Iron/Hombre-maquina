package com.centromedico.ms_detalle_farmacia.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class DetalleFarmacia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDetalle;
    private Long idReceta;
    private Long idMedicamento;
    private Integer cantidad;
}