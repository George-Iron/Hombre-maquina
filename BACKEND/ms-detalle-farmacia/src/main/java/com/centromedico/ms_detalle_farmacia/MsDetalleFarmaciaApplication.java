package com.centromedico.ms_detalle_farmacia;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MsDetalleFarmaciaApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsDetalleFarmaciaApplication.class, args);
	}

}
