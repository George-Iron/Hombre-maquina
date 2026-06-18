package com.centromedico.ms_farmacia.service;

import com.centromedico.ms_farmacia.entity.Medicamento;
import com.centromedico.ms_farmacia.repository.MedicamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioFarmacia {

    @Autowired
    private MedicamentoRepository repository;

    public Medicamento registrar(Medicamento med) {
        return repository.save(med);
    }

    public List<Medicamento> listar() {
        return repository.findAll();
    }

    public Optional<Medicamento> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Medicamento actualizar(Long id, Medicamento datos) {
        return repository.findById(id).map(m -> {
            m.setNombre(datos.getNombre());
            return repository.save(m);
        }).orElseThrow(() -> new RuntimeException("No encontrado"));
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }

}
