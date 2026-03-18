FROM node:18-alpine

# Install OpenSSL 3 for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Install global dependencies
RUN npm install -g @nestjs/cli

# Copy package files first
COPY package*.json ./

# Install project dependencies WITH legacy-peer-deps flag
RUN npm install --legacy-peer-deps

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy entire project
COPY . .

# Build the project
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
