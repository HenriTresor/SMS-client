FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Install dependencies first
COPY package*.json ./
COPY prisma ./prisma
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Final runtime image
FROM node:20-alpine AS runtime
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/dist ./dist
COPY package*.json ./
COPY prisma ./prisma

# Remove dev dependencies to keep runtime lean
RUN npm prune --omit=dev

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
