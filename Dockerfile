# Build stage
FROM node:20-alpine3.17 AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
# Verify build output exists
RUN ls -la dist/

# Production stage
FROM node:20-alpine3.17 AS production
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
# Required for tsconfig-paths to resolve @domain/*, @application/*, etc. at runtime
COPY tsconfig.json ./tsconfig.json
COPY prisma ./prisma
EXPOSE 3000
CMD ["node", "-r", "tsconfig-paths/register", "dist/main"]
