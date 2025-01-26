# 1) Build Stage
FROM node:18 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# 2) Production Stage (Nginx)
FROM nginx:alpine
COPY --from=build /app/dist/angular-frontend/browser /usr/share/nginx/html


# Expose port 80 inside container
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
