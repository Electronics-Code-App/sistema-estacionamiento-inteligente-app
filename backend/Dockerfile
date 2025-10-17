# Etapa 1: Construcción con Maven y Java 21
FROM maven:3.8.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copiamos el pom primero para cachear dependencias si no cambian
COPY pom.xml .

# Descargamos las dependencias (optimiza la build)
RUN mvn dependency:go-offline

# Copiamos el código fuente
COPY src ./src

# Construimos el proyecto (skip tests para acelerar)
RUN mvn clean package -DskipTests

# Etapa 2: Imagen ligera para ejecutar la app con Java 21
FROM eclipse-temurin:21-jdk-focal

WORKDIR /app

# Copiamos el JAR desde la etapa de build
COPY --from=build /app/target/backend-1.0.0.jar app.jar

# Exponemos el puerto que usa Spring Boot (por defecto 8080)
EXPOSE 8080

# Comando para ejecutar la app
ENTRYPOINT ["java", "-jar", "app.jar"]
