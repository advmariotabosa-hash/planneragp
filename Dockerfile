FROM node:18-alpine

WORKDIR /app

# Install global dependencies
RUN npm install -g @nestjs/cli

# Copy package files first
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy entire project
COPY . .

# Build the project
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
