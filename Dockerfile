# Use official Node.js image as the base image
FROM node:20.13.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for backend
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the app runs on
EXPOSE 8080

# Command to run the backend server
CMD ["node", "index.js"]