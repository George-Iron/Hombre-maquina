package com.plataform.Seguridad_Server.Client;
import com.plataform.Seguridad_Server.DTOs.PersonalClientDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "ms-personal")
public interface PersonalClient {
    @GetMapping("/api/personal/listar")
    List<PersonalClientDTO> listarPersonal();
    @GetMapping("/api/personal/buscar/{dni}")
    PersonalClientDTO buscarEmpleado(@PathVariable String dni);
}
