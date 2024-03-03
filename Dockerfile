FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build
#RUN npx prisma generate
#RUN npx prisma migrate dev

#EXPOSE 4000

CMD [ "npm", "run", "start:dev" ]
