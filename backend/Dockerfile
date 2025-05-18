# Imagen base con Maven 3.9.9 y OpenJDK 17
FROM maven:3.9.9-eclipse-temurin-17

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar todos los archivos del proyecto al contenedor
COPY . .

# Exponer el puerto en el que corre tu app (ajusta si es otro)
EXPOSE 8080

# Ejecutar la app usando mvn spring-boot:run
CMD ["mvn", "spring-boot:run"]

