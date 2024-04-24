# Use alpine official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Bundle the app source inside the Docker image
COPY . .

# Define the command to run the app
CMD [ "npm", "start" ]

# Set environment variables
ENV USER_SERVICE_PORT=3000
