package com.centromedico.ms_programacion_horario.config;

import com.centromedico.ms_programacion_horario.entity.Consultorio;
import com.centromedico.ms_programacion_horario.repository.ConsultorioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner initConsultorios(ConsultorioRepository consultorioRepository, com.centromedico.ms_programacion_horario.repository.ProgramacionRepository programacionRepository) {
        return args -> {
            Consultorio c1 = null;
            if (consultorioRepository.count() == 0) {
                c1 = new Consultorio();
                c1.setNombre("Consultorio 101");
                c1 = consultorioRepository.save(c1);

                Consultorio c2 = new Consultorio();
                c2.setNombre("Consultorio 102");
                consultorioRepository.save(c2);

                System.out.println("Consultorios por defecto inicializados.");
            } else {
                c1 = consultorioRepository.findAll().get(0);
            }

            if (programacionRepository.count() == 0 && c1 != null) {
                com.centromedico.ms_programacion_horario.entity.ProgramacionHorario h1 = new com.centromedico.ms_programacion_horario.entity.ProgramacionHorario();
                h1.setIdMedico(1L);
                h1.setNombreMedico("Dr. Prueba");
                h1.setEspecialidadMedico("Cardiologia");
                h1.setConsultorio(c1);
                h1.setFecha(java.time.LocalDate.now().plusDays(1));
                h1.setTurno("MAÑANA");
                h1.setHoraInicio(java.time.LocalTime.of(9, 0));
                h1.setHoraFin(java.time.LocalTime.of(9, 30));
                h1.setDisponible(true);
                programacionRepository.save(h1);
                
                System.out.println("Horarios por defecto inicializados.");
            }
        };
    }
}
