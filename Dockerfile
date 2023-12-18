FROM node:16

WORKDIR /usr/src/app

ENV HOST=https://magnificent-hummingbird-b1c42a.netlify.app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000 4000

CMD ["npm", "start"]
