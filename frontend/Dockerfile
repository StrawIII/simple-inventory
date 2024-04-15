FROM node:21

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5173 8080 3000

CMD ["npm", "run", "preview"]
