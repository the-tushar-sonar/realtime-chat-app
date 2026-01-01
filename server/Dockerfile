FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install jsonwebtoken

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
