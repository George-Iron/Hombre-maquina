# 🏥 Sistema de Gestión Médica y Clínica

Sistema integral de gestión clínica multi-modulo desarrollado con una arquitectura distribuida basada en **Microservicios (Spring Boot)** y una interfaz web moderna en **React (Vite)**.

---

## 🛠️ Stack Tecnológico

* **Backend:** Java 17+, Spring Boot, Spring Cloud Eureka (Service Discovery), Spring Cloud Gateway, Spring Security / JWT.
* **Frontend:** React, Vite, JavaScript, HTML5, CSS3 / TailwindCSS.
* **Contenedorización & Orquestación:** Docker, Docker Compose, Nginx.

---

## 🏗️ Arquitectura del Sistema

El sistema está dividido en microservicios independientes que se comunican a través del **API Gateway** y se registran dinámicamente en el **Eureka Server**.

```
                           +-------------------+
                           |  Frontend (React) | (Puerto 5173 / Nginx)
                           +---------+---------+
                                     |
                                     v
                           +-------------------+
                           |    API Gateway    | (Puerto 8080)
                           +---------+---------+
                                     |
         +---------------------------+---------------------------+
         |                           |                           |
+--------v--------+         +--------v--------+         +--------v--------+
| Seguridad Server|         |   ms-paciente   |         |    ms-citas     | ... otros microservicios
|  (Puerto 8050)  |         |  (Puerto 8087)  |         |  (Puerto 8092)  |
+-----------------+         +-----------------+         +-----------------+
         |                           |                           |
         +---------------------------+---------------------------+
                                     |
                           +---------v---------+
                           |   Eureka Server   | (Puerto 8761)
                           +-------------------+
```

---

## 🔌 Tabla de Servicios y Puertos

| Servicio | Tipo | Puerto Contenedor / Host | Descripción |
| :--- | :--- | :---: | :--- |
| `eureka-server` | Infraestructura | `8761` | Servidor de descubrimiento de servicios |
| `api-gateway` | Infraestructura | `8080` | Puerta de enlace principal para peticiones HTTP |
| `seguridad-server` | Infraestructura | `8050` | Autenticación, autorización y emisión de tokens JWT |
| `frontend-clinica` | Frontend | `5173` | Aplicación web en React (Vite / Nginx) |
| `ms-paciente` | Microservicio | `8087` | Gestión de expedientes y datos del paciente |
| `ms-personal` | Microservicio | `8089` | Gestión de médicos y personal administrativo |
| `ms-citas` | Microservicio | `8092` | Agendamiento y control de citas médicas |
| `ms-atencion-medica` | Microservicio | `8096` | Consultas médicas y diagnósticos |
| `ms-historia` | Microservicio | `8088` | Historias clínicas de pacientes |
| `ms-farmacia` | Microservicio | `8094` | Gestión de inventario de farmacia |
| `ms-compuesto-farmacia` | Microservicio | `8081` | Composición y lotes de fármacos |
| `ms-detalle-farmacia` | Microservicio | `8083` | Detalles y dispensación de medicamentos |
| `ms-receta` | Microservicio | `8082` | Emisión de recetas médicas |
| `ms-laboratorio` | Microservicio | `8095` | Gestión de servicios de laboratorio |
| `ms-compuesto-laboratorio` | Microservicio | `8098` | Composición de pruebas de laboratorio |
| `ms-detalle-laboratorio` | Microservicio | `8086` | Detalles y entrega de resultados |
| `ms-analisis` | Microservicio | `8085` | Procesamiento y órdenes de análisis |
| `ms-facturacion` | Microservicio | `8093` | Emisión de comprobantes y pagos |
| `ms-programacion-horario` | Microservicio | `8091` | Turnos y horarios de atención médica |
| `ms-orquestador` | Microservicio | `8090` | Orquestación de flujos complejos de negocio |

---

## 🚀 Requisitos e Instalación

### Prerrequisitos
* **Docker Desktop** (con Docker Compose v2+)
* **Node.js** v18+ (opcional, solo para desarrollo local del Frontend)
* **Java JDK 17+** y **Maven** (opcional, solo para desarrollo local del Backend)

---

### 🐳 Ejecución rápida con Docker Compose (Recomendado)

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/George-Iron/Hombre-maquina.git
   cd TrabajoHombreMaquina
   ```

2. **Construir y levantar todos los contenedores:**
   ```bash
   docker-compose up --build -d
   ```

3. **Verificar estado de los contenedores:**
   ```bash
   docker-compose ps
   ```

4. **Acceso a los servicios:**
   * 💻 **Frontend Web:** [http://localhost:5173](http://localhost:5173)
   * 🌐 **API Gateway:** [http://localhost:8080](http://localhost:8080)
   * 🔍 **Eureka Discovery Dashboard:** [http://localhost:8761](http://localhost:8761)

5. **Detener el entorno:**
   ```bash
   docker-compose down
   ```

---

## 💻 Desarrollo Local (Sin Docker)

### Frontend (`frontend-clinica`)
```bash
cd frontend-clinica
npm install
npm run dev
```

### Backend (`BACKEND/<microservicio>`)
1. Iniciar **Eureka Server** (`BACKEND/eureka-server`).
2. Iniciar **API Gateway** (`BACKEND/api-gateway`) y **Seguridad Server** (`BACKEND/Seguridad-Server`).
3. Iniciar el microservicio deseado ejecutando `./mvnw spring-boot:run` dentro de su respectivo directorio.

---

## 📁 Estructura del Repositorio

```
.
├── BACKEND/                  # Microservicios en Java / Spring Boot
│   ├── eureka-server/        # Registro de servicios
│   ├── api-gateway/          # Router principal
│   ├── Seguridad-Server/     # Autenticación y JWT
│   └── ms-*/                 # Microservicios de dominio
├── frontend-clinica/         # Aplicación SPA en React + Vite
├── docker-compose.yml        # Orquestación global de Docker
└── README.md                 # Documentación principal
```
