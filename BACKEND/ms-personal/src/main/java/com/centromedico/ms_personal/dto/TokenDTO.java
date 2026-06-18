package com.centromedico.ms_personal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class TokenDTO {

    private String token;

    public TokenDTO(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
