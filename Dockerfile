# 1) Node-Umgebung zum Bauen
FROM node:18 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .
# In neueren Angular-Versionen kann das Build-Skript "build" oder "build --configuration production" heißen
RUN npm run build --prod

# 2) NGINX zum Ausliefern
FROM nginx:alpine
COPY --from=build /app/dist/angular-frontend /usr/share/nginx/html
