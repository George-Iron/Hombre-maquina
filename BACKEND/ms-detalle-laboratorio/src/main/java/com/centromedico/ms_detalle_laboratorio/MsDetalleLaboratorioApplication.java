package com.centromedico.ms_detalle_laboratorio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MsDetalleLaboratorioApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsDetalleLaboratorioApplication.class, args);
	}

}
