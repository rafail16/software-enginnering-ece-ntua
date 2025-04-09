FROM node:latest

WORKDIR C:/Users/razkey/git/saa50/saas-50/SOA/Analytics

COPY package*.json ./

RUN npm install 

COPY . . 

EXPOSE 4000

CMD ["npm", "run", "start"]