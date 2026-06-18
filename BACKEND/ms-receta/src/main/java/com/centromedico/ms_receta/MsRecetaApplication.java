package com.centromedico.ms_receta;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MsRecetaApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsRecetaApplication.class, args);
	}

}
