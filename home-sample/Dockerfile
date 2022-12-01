# Base image
FROM node:16.0.0

# Make folder to put our files in
RUN mkdir -p /usr/src/home-sample

# Set working directory so that all 
# subsequent command runs in this folder
WORKDIR /usr/src/home-sample

# Copy all src
COPY . /
RUN yarn install

# Copy our app
COPY . .

# Expose port to access server
EXPOSE 3000
# Command to run our app
ENTRYPOINT [ "yarn", "start"]