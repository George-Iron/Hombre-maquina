package com.centromedico.ms_programacion_horario.client;

import com.centromedico.ms_programacion_horario.dto.CitaDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "ms-citas", path = "/api/cita")
public interface CitaClient {

    @GetMapping("/listar")
    ResponseEntity<List<CitaDTO>> listarCitas();

}
