# Build stage
FROM node:20-slim AS build

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Set environment variable for the API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration if needed (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
