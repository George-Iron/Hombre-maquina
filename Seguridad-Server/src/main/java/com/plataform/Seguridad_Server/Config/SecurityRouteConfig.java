package com.plataform.Seguridad_Server.Config;


import com.plataform.Seguridad_Server.Security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityRouteConfig {
    @Autowired
    private JwtFilter jwtFilter;
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers
                        .frameOptions(frame -> frame.disable()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/api/security/loginAsistente").permitAll()
                        .requestMatchers("/auth/registerAsistenteAuth").hasRole("ADMIN")
                        .requestMatchers("/auth/registerUserAuth").permitAll()
                        .requestMatchers("/auth/listarAuthEmpleados").hasRole("ADMIN")
                        .requestMatchers("/api/security/libre").permitAll()
                        .requestMatchers("/api/security/seguro").hasAnyRole("USER","ADMIN")
                        .requestMatchers("/auth/listarEmpleadosLogeados").hasRole("ADMIN")
                        .requestMatchers("/auth/buscarDniAuthEmpleado/{dni}").authenticated()
                        .requestMatchers("/auth/buscarDniAuthUsuario/{dni}").authenticated()
                        .anyRequest().permitAll()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> logout.permitAll());
        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {return new BCryptPasswordEncoder();}
}
