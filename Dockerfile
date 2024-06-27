FROM node:19-alpine

COPY package*.json /app/

WORKDIR /app

RUN npm install

CMD ["npm", "run", "dev"]

