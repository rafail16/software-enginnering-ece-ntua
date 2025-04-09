FROM node:latest

WORKDIR C:/Users/razkey/git/saa50/saas-50/SOA/QAManager

COPY package*.json ./

RUN npm install 

COPY . . 

EXPOSE 5000

CMD ["npm", "run", "start"]