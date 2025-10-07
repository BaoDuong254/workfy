# Base image
FROM node:trixie-slim

# Create app directory
WORKDIR /baoduong/workfy

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install --legacy-peer-deps

RUN npm i -g @nestjs/cli@latest

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
