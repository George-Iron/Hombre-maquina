package com.centromedico.ms_atencion_medica.service;

import com.centromedico.ms_atencion_medica.client.CitaClient;
import com.centromedico.ms_atencion_medica.client.FarmaciaClient;
import com.centromedico.ms_atencion_medica.client.LaboratorioClient;
import com.centromedico.ms_atencion_medica.dto.AnalisisDTO;
import com.centromedico.ms_atencion_medica.dto.CitaDTO;
import com.centromedico.ms_atencion_medica.dto.MedicamentoDTO;
import com.centromedico.ms_atencion_medica.entity.AtencionMedica;
import com.centromedico.ms_atencion_medica.entity.DetalleAnalisis;
import com.centromedico.ms_atencion_medica.entity.DetalleReceta;
import com.centromedico.ms_atencion_medica.repository.AtencionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ServicioAtencion {

    @Autowired
    private AtencionRepository atencionRepository;

    @Autowired
    private CitaClient citaClient;

    @Autowired
    private FarmaciaClient farmaciaClient;

    @Autowired
    private LaboratorioClient laboratorioClient;

    public AtencionMedica registrarAtencion(AtencionMedica atencion) {
        // 1. Validar cita
        CitaDTO cita = citaClient.buscarCitaPorId(atencion.getIdCita()).getBody();
        if (cita == null) throw new RuntimeException("Cita no encontrada");

        // 2. Validar pago
        if (!"PAGADA".equals(cita.getEstado())) throw new RuntimeException("La cita no ha sido pagada");

        // 3. Completar datos automáticos
        atencion.setIdPaciente(cita.getIdPaciente());
        atencion.setFechaAtencion(LocalDateTime.now());

        // 4. Buscar nombres de medicamentos
        if (atencion.getReceta() != null) {
            for (DetalleReceta item : atencion.getReceta()) {

                try {
                    MedicamentoDTO med = farmaciaClient.buscarMedicamento(item.getIdMedicamento()).getBody();
                    if (med != null) item.setNombreMedicamento(med.getNombre());
                } catch (Exception e) {
                    item.setNombreMedicamento("Desconocido (Error MS-Farmacia)");
                }
            }
        }

        // 5. Buscar nombres de análisis
        if (atencion.getOrdenesAnalisis() != null) {
            for (DetalleAnalisis item : atencion.getOrdenesAnalisis()) {
                try {
                    AnalisisDTO ana = laboratorioClient.buscarAnalisis(item.getIdTipoAnalisis()).getBody();
                    if (ana != null) item.setNombreAnalisis(ana.getNombre());
                } catch (Exception e) {
                    item.setNombreAnalisis("Desconocido (Error MS-Laboratorio)");
                }
            }
        }

        return atencionRepository.save(atencion);
    }

    public List<AtencionMedica> listarAtenciones() {
        return atencionRepository.findAll();
    }

    public List<AtencionMedica> listarPorPaciente(Long idPaciente) {
        return atencionRepository.findByIdPaciente(idPaciente);
    }
}