package com.centromedico.ms_programacion_horario;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class MsProgramacionHorarioApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsProgramacionHorarioApplication.class, args);
	}

}
