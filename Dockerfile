# Base image
FROM node:18.18.0

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build app
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "start:dev"] 