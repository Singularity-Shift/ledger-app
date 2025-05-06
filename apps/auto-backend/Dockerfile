FROM node:18-slim

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

EXPOSE 3050
CMD ["node", "dist/main.js"] 