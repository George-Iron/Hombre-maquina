package com.centromedico.api_gateway.security;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouterValidator {

    public static final List<String> openApiEndpoints = List.of(
            "/api/personal/login",
            "/api/personal/registrar",
            "/api/paciente/registrar", // Permitimos registrarse a pacientes nuevos
            "/api/security/loginAsistente",
            "/api/security/registerAsistente",
            "/eureka",
            "/api-docs",
            "/swagger-ui"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));
}
