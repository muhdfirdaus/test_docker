# Use Node.js 14 LTS as the base image for Node.js, or appropriate base image for C#
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json, index.js (or Program.cs), and config.json to the working directory
COPY package*.json ./
COPY index.js ./  
COPY config.json ./

# Install dependencies for Node.js if applicable
RUN npm install

# Define the default command that runs your script
CMD ["node", "index.js"]  
