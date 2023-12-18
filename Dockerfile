FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
ENV HOST=https://magnificent-hummingbird-b1c42a.netlify.app/
EXPOSE 3000 4000

CMD ["npm", "start"]
