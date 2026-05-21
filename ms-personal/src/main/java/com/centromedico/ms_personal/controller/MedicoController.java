package com.centromedico.ms_personal.controller;

import com.centromedico.ms_personal.entity.Medico;
import com.centromedico.ms_personal.service.MedicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personal/medico")
public class MedicoController {
    @Autowired
    private MedicoService service_medico;

    @GetMapping("/libre")
    public String libre(){
        return "RUTA LIBRE PARA TODOS OÑO";
    }

    @GetMapping("/seguro")
    public String seguro(){
        return "RUTA SEGURA PARA QUE NADIE PUEDA ENTRAR A NO SER QUE ESTE LOGEADO OÑO";
    }
    @GetMapping("/listar")
    public List<Medico> listarMedicos(){
        return service_medico.listarMedico();
    }

    @PostMapping("/crear")
    public Medico crearMedico(@RequestBody Medico medico){
        return service_medico.agregarMedico(medico);
    }
}
