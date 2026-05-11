package com.centromedico.ms_orquestador.client;

import com.centromedico.ms_orquestador.dto.AtencionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "ms-atencion-medica", path = "/api/atencion")
public interface AtencionClient {
    @GetMapping("/historial/{idPaciente}")
    ResponseEntity<List<AtencionDTO>> listarHistorial(@PathVariable Long idPaciente);

}
