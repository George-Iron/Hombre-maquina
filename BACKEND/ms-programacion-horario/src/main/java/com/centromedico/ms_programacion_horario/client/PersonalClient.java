package com.centromedico.ms_programacion_horario.client;

import com.centromedico.ms_programacion_horario.dto.MedicoDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-personal", path = "/api/personal")
public interface PersonalClient {

    @GetMapping("/empleado/buscar-id/{id}")
    ResponseEntity<MedicoDTO> buscarEmpleadoPorId(@PathVariable Long id);

}
