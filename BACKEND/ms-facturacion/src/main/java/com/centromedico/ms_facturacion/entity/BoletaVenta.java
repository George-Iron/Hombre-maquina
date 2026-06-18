package com.centromedico.ms_facturacion.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class BoletaVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idBoleta;

    private Long idCita; //referencia a la cita pagada
    private Long idCajero; // idEmpleado

    private String serie;
    private LocalDate fechaEmision;
    private Double montoTotal;
    private String estado; //PAGADA o ANULADA

}
