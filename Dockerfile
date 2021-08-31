FROM node:14

WORKDIR /apps/ak-videouploader

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 9090

CMD ["npm", "start"]