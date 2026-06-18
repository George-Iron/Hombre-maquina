package com.centromedico.ms_orquestador.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ExpedienteDTO {

    private PacienteDTO paciente;
    private HistoriaDTO historia;
    private List<AtencionDTO> atenciones;

}
