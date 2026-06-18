package com.centromedico.ms_farmacia.repository;

import com.centromedico.ms_farmacia.entity.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicamentoRepository extends JpaRepository<Medicamento, Long> {
}
