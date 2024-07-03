# Use official Node.js image as the base image
FROM node:20.13.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for backend
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Change directory to client
WORKDIR /usr/src/app/client

# Copy package.json and package-lock.json for frontend
COPY client/package*.json ./

# Install frontend dependencies
RUN npm install

# Change directory back to the root of the app
WORKDIR /usr/src/app

# Copy the rest of the application code to the container
COPY . .

# Build the React app
# RUN npm run build

# Expose the port that the app runs on
EXPOSE 8080

# Command to run the backend server
CMD ["node", "index.js"]
