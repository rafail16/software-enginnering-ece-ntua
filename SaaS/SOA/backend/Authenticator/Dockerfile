FROM node:latest

WORKDIR C:/Users/razkey/git/saa50/saas-50/SOA/Authenticator

COPY package*.json ./

RUN npm install 

COPY . . 

EXPOSE 8000

CMD ["npm", "run", "start"]