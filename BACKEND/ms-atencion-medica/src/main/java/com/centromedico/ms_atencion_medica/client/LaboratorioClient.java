package com.centromedico.ms_atencion_medica.client;

import com.centromedico.ms_atencion_medica.dto.AnalisisDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-laboratorio", path = "/api/laboratorio")
public interface LaboratorioClient {

    @GetMapping("/{id}")
    ResponseEntity<AnalisisDTO> buscarAnalisis(@PathVariable Long id);

}
