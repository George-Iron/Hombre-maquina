package com.centromedico.ms_atencion_medica;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
@EnableDiscoveryClient
public class MsAtencionMedicaApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsAtencionMedicaApplication.class, args);
	}

}
