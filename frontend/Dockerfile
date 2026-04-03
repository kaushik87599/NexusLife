ARG NODE_VERSION=20.19.5
FROM node:${NODE_VERSION}-alpine

# Change this to development
ENV NODE_ENV development

WORKDIR /usr/src/app

# Install ALL dependencies (including devDependencies like Next and TS)
COPY package*.json ./
RUN npm install

# We don't switch to USER node yet because it causes permission 
# issues with local volumes during development.
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]   