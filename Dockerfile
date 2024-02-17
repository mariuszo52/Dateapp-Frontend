FROM node:14
WORKDIR /usr/src/app
COPY Shop-Online-Front/package*.json ./
RUN npm install
RUN npm install --save @fortawesome/fontawesome-svg-core
COPY Shop-Online-Front .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]