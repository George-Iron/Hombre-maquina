package com.centromedico.ms_laboratorio.service;

import com.centromedico.ms_laboratorio.entity.TipoAnalisis;
import com.centromedico.ms_laboratorio.repository.TipoAnalisisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioLaboratorio {

    @Autowired
    private TipoAnalisisRepository repository;

    public TipoAnalisis registrar(TipoAnalisis tipo) {
        return repository.save(tipo);
    }

    public List<TipoAnalisis> listar() {
        return repository.findAll();
    }

    public Optional<TipoAnalisis> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public TipoAnalisis actualizar(Long id, TipoAnalisis nuevosDatos) {
        return repository.findById(id).map(analisis -> {
            analisis.setNombre(nuevosDatos.getNombre());
            analisis.setDescripcion(nuevosDatos.getDescripcion());
            return repository.save(analisis);
        }).orElseThrow(() -> new RuntimeException("Tipo de Análisis no encontrado"));
    }

    public void eliminar(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new RuntimeException("No se puede eliminar: ID no existe");
        }
    }

}
