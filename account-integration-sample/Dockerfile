# Base image
FROM node:16.0.0

# Make folder to put our files in
RUN mkdir -p /usr/src/account-integration-sample

# Set working directory so that all 
# subsequent command runs in this folder
WORKDIR /usr/src/account-integration-sample

# Copy package json and install dependencies
COPY package*.json ./
COPY *.js ./ 
COPY . /
COPY yarn.lock ./
RUN yarn install

# Copy our app
COPY . .

# Expose port to access server
EXPOSE 3001
# Command to run our app
ENTRYPOINT [ "yarn", "start"]