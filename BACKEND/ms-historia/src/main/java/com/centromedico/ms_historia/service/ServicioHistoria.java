package com.centromedico.ms_historia.service;

import com.centromedico.ms_historia.entity.Historia;
import com.centromedico.ms_historia.repository.HistoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ServicioHistoria {

    @Autowired
    private HistoriaRepository historiaRepository;

    public Optional<Historia> buscarPorIdPaciente(Long idPaciente){
        return historiaRepository.findByIdPaciente(idPaciente);
    }

    public Historia registrar(Historia historia){
        return historiaRepository.save(historia);
    }

}
