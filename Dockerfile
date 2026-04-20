FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent

# Copy source and build
COPY . .
RUN npm run build --configuration=production

FROM nginx:stable-alpine

# Copy built files from builder stage
COPY --from=build /app/dist/amcart /usr/share/nginx/html

# Use custom nginx config (added alongside Dockerfile)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
