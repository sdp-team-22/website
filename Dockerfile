# Stage 1: Build the Angular app
FROM node:18.13.0 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production --output-path=dist/aftas-angular

# Stage 2: Serve the Angular app with Nginx
FROM nginx:latest

# Copy the built Angular app from the build stage to the nginx server
COPY --from=build /app/dist/aftas-angular /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80
