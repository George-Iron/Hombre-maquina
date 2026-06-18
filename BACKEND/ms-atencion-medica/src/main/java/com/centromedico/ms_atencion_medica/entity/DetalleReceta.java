package com.centromedico.ms_atencion_medica.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class DetalleReceta {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long idDetalleReceta;

    private Long idMedicamento;
    private String nombreMedicamento;
    private String dosis;

}
