FROM node:20-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Use the same image for the production environment
FROM node:20-alpine as production

WORKDIR /app

# Copy package files for runtime dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm install --production --legacy-peer-deps

# Copy the built application from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

# Copy necessary configuration files
COPY vite.config.ts ./

# Expose the port the app runs on
EXPOSE 4173

# Command to run the application
CMD ["npm", "run", "preview"] 