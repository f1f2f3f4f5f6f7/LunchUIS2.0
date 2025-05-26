# Usa una imagen base de Node.js
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Configuración para evitar el error de certificados
RUN npm config set strict-ssl false
RUN npm config set registry http://registry.npmjs.org/

# Instala Angular CLI y las dependencias de la aplicación
RUN npm install -g @angular/cli
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto de Angular
EXPOSE 4200

# Comando para iniciar el frontend
CMD ["ng", "serve", "--host", "0.0.0.0"]
