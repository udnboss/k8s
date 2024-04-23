# Use alpine Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Bundle the app source inside the Docker image
COPY . .

EXPOSE 3000

# Define the command to run the app
CMD [ "npm", "start" ]

