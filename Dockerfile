FROM node:20 as build

WORKDIR /app

COPY package*.json ./
#COPY prisma ./prisma/

RUN npm install


FROM node:20-alpine
COPY --from=build /app /

COPY . .

RUN npm run build

#EXPOSE 4000

CMD [ "npm", "run", "start:db" ]
