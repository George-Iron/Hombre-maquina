package com.centromedico.ms_personal.config;

import com.centromedico.ms_personal.entity.Empleado;
import com.centromedico.ms_personal.entity.Rol;
import com.centromedico.ms_personal.repository.EmpleadoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner initDatabase(EmpleadoRepository repository) {
        return args -> {
            if (!repository.findByDni("12345678").isPresent()) {
                Empleado admin = new Empleado();
                admin.setNombre("Administrador");
                admin.setApellido("Sistema");
                admin.setDni("12345678");
                admin.setCorreo("admin@admin.com");
                admin.setContraseña("123456");
                admin.setEnable(true);
                admin.setRol(Rol.ADMIN);
                repository.save(admin);
                System.out.println("Usuario Administrador por defecto inicializado en ms-personal.");
            }
        };
    }
}
