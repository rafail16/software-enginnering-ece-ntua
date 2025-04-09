FROM node:latest

WORKDIR C:/Users/razkey/git/saa50/saas-50/SOA/ESB

COPY package*.json ./

RUN npm install 

COPY . . 

EXPOSE 3001

CMD ["npm", "run", "start"]