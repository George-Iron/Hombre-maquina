package com.centromedico.ms_historia.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Historia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idHistoria;
    private Long idPaciente; //la clave foranea
    private String peso;
    private String talla;
    private String estado;

}
