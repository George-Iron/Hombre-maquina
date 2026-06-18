package com.centromedico.ms_detalle_laboratorio.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class DetalleLaboratorio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDetalle;
    private Long idAnalisis;
    private Long idTipoAnalisis;
}
