FROM node:20.19-alpine3.21

WORKDIR /

COPY package.json package-lock.json /

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
