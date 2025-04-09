# Using Node:10 Image Since it contains all 
# the necessary build tools required for dependencies with native build (node-gyp, python, gcc, g++, make)
# First Stage : to install and build dependences

FROM node:latest AS builder
WORKDIR C:/Users/razkey/git/saa50/saas-50/MVC/MVC
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build


# Second Stage : Setup command to run your app using lightweight node image
FROM node:latest
WORKDIR C:/Users/razkey/git/saa50/saas-50/MVC/MVC
COPY --from=builder C:/Users/razkey/git/saa50/saas-50/MVC/MVC ./
EXPOSE 3000
CMD ["npm", "run", "start"]
