FROM node:14.15 as app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD node bot.js