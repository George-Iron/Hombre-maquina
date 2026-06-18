package com.centromedico.ms_atencion_medica.client;

import com.centromedico.ms_atencion_medica.dto.CitaDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-citas", path = "/api/cita")
public interface CitaClient {

    @GetMapping("/{id}")
    ResponseEntity<CitaDTO> buscarCitaPorId(@PathVariable Long id);

}
