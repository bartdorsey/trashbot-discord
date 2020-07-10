FROM node:lts

RUN apt update && apt install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

WORKDIR /app

COPY . .

RUN npm install && npm run build

CMD npm start
