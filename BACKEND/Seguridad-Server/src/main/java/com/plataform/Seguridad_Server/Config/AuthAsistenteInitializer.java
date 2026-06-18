package com.plataform.Seguridad_Server.Config;

import com.plataform.Seguridad_Server.Model.AuthPersonalModel;
import com.plataform.Seguridad_Server.Repository.AuthPersonalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class AuthAsistenteInitializer implements CommandLineRunner {
    @Autowired
    private AuthPersonalRepository asistenteRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Override
    public void run(String... args) {
        Optional<?> existeAdmin = asistenteRepository.findByDniAuth("12345678");
        if (existeAdmin.isEmpty()) {
            AuthPersonalModel admin = new AuthPersonalModel();
            admin.setDniAuth("12345678");
            admin.setRolAuth("ADMIN");
            admin.setCorreoAuth("administrador@gmail.com");
            admin.setHabilitadoAuth(true);
            admin.setContraseñaAuth(passwordEncoder.encode("admin123"));
            asistenteRepository.save(admin);
            System.out.println("✅ ADMIN logeado automáticamente oño");
        }
    }
}
