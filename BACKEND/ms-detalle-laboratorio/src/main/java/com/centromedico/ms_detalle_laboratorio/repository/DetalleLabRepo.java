package com.centromedico.ms_detalle_laboratorio.repository;

import com.centromedico.ms_detalle_laboratorio.entity.DetalleLaboratorio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetalleLabRepo extends JpaRepository<DetalleLaboratorio, Long> {
    List<DetalleLaboratorio> findByIdAnalisis(Long idAnalisis);
}
