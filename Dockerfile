FROM node:20-alpine3.17

# Required by Prisma on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Install ALL dependencies (dev included) — needed to compile TypeScript
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript directly with tsc — errors are fully visible in build logs
RUN npx tsc -p tsconfig.build.json

# Verify the entry point exists before declaring success
RUN test -f dist/main.js || (echo "ERROR: dist/main.js was not created. Build failed." && exit 1)

EXPOSE 3000
ENV NODE_ENV=production

# tsconfig-paths resolves @domain/*, @application/*, etc. at runtime
CMD ["node", "-r", "tsconfig-paths/register", "dist/main"]
