package com.centromedico.ms_citas.client;

import com.centromedico.ms_citas.dto.PacienteDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-paciente", path = "/api/paciente")
public interface PacienteClient {

    @GetMapping("/buscar/{dni}")
    ResponseEntity<PacienteDTO> buscarPorDni(@PathVariable String dni);

}
