FROM node:20-alpine3.17

# Required by Prisma on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Install ALL dependencies (dev included) — needed to compile TypeScript
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client and compile TypeScript
# If either step fails, Docker build fails with a visible error
RUN npx prisma generate
RUN npm run build

# Verify the entry point exists before declaring success
RUN test -f dist/main.js || (echo "ERROR: dist/main.js was not created. Build failed." && exit 1)

EXPOSE 3000
ENV NODE_ENV=production

# tsconfig-paths resolves @domain/*, @application/*, etc. at runtime
# tsconfig.json is available in /app from the COPY above
CMD ["node", "-r", "tsconfig-paths/register", "dist/main"]
