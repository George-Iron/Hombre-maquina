package com.centromedico.ms_facturacion.client;

import com.centromedico.ms_facturacion.dto.CitaDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "ms-citas", path = "/api/cita")
public interface CitaClient {
    @GetMapping("/{id}")
    ResponseEntity<CitaDTO> buscarCitaPorId(@PathVariable Long id);

    // Agregar este método
    @PutMapping("/actualizar-estado/{id}")
    void actualizarEstado(@PathVariable("id") Long id, @RequestParam("estado") String estado);
}
