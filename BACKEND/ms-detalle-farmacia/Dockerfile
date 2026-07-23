# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
# Use BuildKit cache mounting to share .m2 directory across builds
RUN --mount=type=cache,target=/root/.m2 mvn dependency:go-offline -B || true
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
