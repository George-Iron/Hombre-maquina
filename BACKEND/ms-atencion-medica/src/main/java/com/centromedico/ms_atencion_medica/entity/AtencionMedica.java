package com.centromedico.ms_atencion_medica.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class AtencionMedica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAtencion;

    private Long idCita;
    private Long idPaciente;

    private String diagnostico;
    private String tratamiento;
    private String observaciones;

    private LocalDateTime fechaAtencion;

    //Relacion con Recetas
    @OneToMany(cascade = CascadeType.ALL)
    private List<DetalleReceta> receta;

    //Relacion con Analisis
    @OneToMany(cascade = CascadeType.ALL)
    private List<DetalleAnalisis> ordenesAnalisis;

}
