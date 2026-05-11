package com.centromedico.ms_orquestador.controller;

import com.centromedico.ms_orquestador.client.HistoriaClient;
import com.centromedico.ms_orquestador.client.PacienteClient;
import com.centromedico.ms_orquestador.dto.ExpedienteDTO;
import com.centromedico.ms_orquestador.dto.HistoriaDTO;
import com.centromedico.ms_orquestador.dto.PacienteDTO;
import com.centromedico.ms_orquestador.service.ServicioOrquestador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orquestador")
public class OrquestadorController implements ApiOrquestador {

    @Autowired
    private ServicioOrquestador servicioOrquestador;

    @Override
    public ResponseEntity<ExpedienteDTO> obtenerExpedienteCompleto(String dni){
        return servicioOrquestador.obtenerExpediente(dni)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
