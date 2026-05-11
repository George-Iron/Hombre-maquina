package com.centromedico.ms_personal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MsPersonalApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsPersonalApplication.class, args);
	}

}
