package com.centromedico.ms_orquestador.controller;

import com.centromedico.ms_orquestador.dto.ExpedienteDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

public interface ApiOrquestador {

    @GetMapping("/expediente/{dni}")
    ResponseEntity<ExpedienteDTO> obtenerExpedienteCompleto(@PathVariable String dni);

}
