package com.centromedico.ms_citas.client;

import com.centromedico.ms_citas.dto.ProgramacionHorarioDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "ms-programacion-horario", path = "/api/programacion")
public interface ProgramacionClient {

    @GetMapping("/horario/disponibles")
    ResponseEntity<List<ProgramacionHorarioDTO>> listarHorariosDisponibles();

    @GetMapping("/horario/{id}")
    ResponseEntity<ProgramacionHorarioDTO> buscarHorario(@PathVariable Long id);

    @PutMapping("/horario/actualizar-estado/{id}")
    void actualizarEstado(@PathVariable("id") Long id,
                          @RequestParam("disponible") boolean disponible);

}
