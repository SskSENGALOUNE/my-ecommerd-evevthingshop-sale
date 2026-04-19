# ---------- deps ----------
    FROM node:18-alpine AS deps

    WORKDIR /app
    
    COPY package*.json ./
    COPY prisma ./prisma
    
    RUN npm ci
    
    
    # ---------- build ----------
    FROM node:18-alpine AS build
    
    WORKDIR /app
    
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    RUN npm run build
    
    
    # ---------- production ----------
    FROM node:18-alpine AS prod
    
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV TZ=Asia/Bangkok
    
    # Copy only what is needed to run
    COPY --from=build /app/dist ./dist
    COPY --from=deps /app/node_modules ./node_modules
    COPY prisma ./prisma
    COPY package*.json ./
    
    EXPOSE 3000
    
    CMD ["node", "dist/main.js"]
    