FROM node:latest

WORKDIR C:/Users/razkey/git/saa50/saas-50/SOA/datalayer

COPY package*.json ./

RUN npm install 

COPY . . 

EXPOSE 3000

CMD ["npm", "run", "start"]