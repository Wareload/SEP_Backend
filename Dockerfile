FROM node:18-alpine3.14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD sleep 30 && npm start