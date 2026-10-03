FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/index.html /usr/share/nginx/html/index.html
COPY --from=build /app/build.css /usr/share/nginx/html/build.css
EXPOSE 80
