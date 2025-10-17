# Etapa 1: Build con Maven y Java 21
FROM maven:3.9.11-eclipse-temurin-21 AS build

WORKDIR /app

# Copiamos los archivos de proyecto
COPY pom.xml .
COPY src ./src

# Construimos el proyecto y empaquetamos el JAR
RUN mvn clean package -DskipTests

# Etapa 2: Imagen runtime con solo JDK 21 para correr la app
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copiamos el JAR construido en la etapa build
COPY --from=build /app/target/*.jar app.jar

# Exponemos el puerto que usa tu aplicación
EXPOSE 8080

# Comando para ejecutar el JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
