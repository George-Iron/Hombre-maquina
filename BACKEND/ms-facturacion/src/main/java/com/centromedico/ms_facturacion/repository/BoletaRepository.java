package com.centromedico.ms_facturacion.repository;

import com.centromedico.ms_facturacion.entity.BoletaVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoletaRepository extends JpaRepository<BoletaVenta, Long> {

    Optional<BoletaVenta> findByIdCita(Long idCita);

}
