FROM node:20-alpine

# Install OpenSSL required by Prisma Engine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package manifests and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy application source and static assets
COPY tsconfig.json ./
COPY src ./src/
COPY public ./public/

# Generate Prisma Client and compile TypeScript
RUN npx prisma generate && npm run build

# Configure runtime environment
ENV NODE_ENV=production
ENV TS_NODE_BASEURL=./dist
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

# Push Prisma schema to PostgreSQL and start the server
CMD ["sh", "-c", "npx prisma db push --skip-generate && npm run start"]
