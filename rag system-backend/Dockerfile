FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p /tmp/uploads

EXPOSE 8080

CMD ["node", "server.js"]
