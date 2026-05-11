package com.centromedico.ms_orquestador.client;

import com.centromedico.ms_orquestador.dto.DetalleCitaDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-citas", path = "/api/cita")
public interface CitaClient {

    @GetMapping("{id}")
    ResponseEntity<DetalleCitaDTO> buscarCitaPorId(@PathVariable("id") Long id);

}
