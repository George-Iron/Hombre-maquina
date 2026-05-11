package com.centromedico.ms_orquestador.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AtencionDTO {

    // Datos propios de la atención
    private Long idAtencion;
    private Long idCita; // Referencia para buscar la trazabilidad
    private Long idPaciente;
    private LocalDateTime fechaAtencion;

    // Datos clínicos
    private String diagnostico;
    private String tratamiento;
    private String observaciones;

    // Listas de detalles (Usando los DTOs que acabamos de crear arriba)
    private List<DetalleRecetaDTO> receta;
    private List<DetalleAnalisisDTO> ordenesAnalisis;

    // --- CAMPOS ENRIQUECIDOS (TRAZABILIDAD) ---
    // Estos se llenan en el ServicioOrquestador consultando a los otros microservicios
    private DetalleCitaDTO infoCita;
    private DetalleFacturacionDTO infoFacturacion;

}
