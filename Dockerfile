# Production Multi-Stage Dockerfile for Emergency Road Planner
FROM node:20-alpine AS build
WORKDIR /app

# Copy package descriptors
COPY package*.json ./
RUN npm ci

# Copy source files and build
COPY . .
RUN npm run build

# Production Runtime (serves on port 3000 / $PORT)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install serve to host static distribution
RUN npm install -g serve

COPY --from=build /app/dist ./dist
COPY --from=build /app/java ./java

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
