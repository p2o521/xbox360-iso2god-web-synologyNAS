# 阶段1：构建
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json ./
RUN npm install --registry=https://registry.npmmirror.com

COPY . .
RUN npm run build
RUN cp -r public .next/standalone/ 2>/dev/null || true
RUN cp -r .next/static .next/standalone/.next/ 2>/dev/null || true

# 阶段2：运行
FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/tools/iso2god /app/tools/iso2god
RUN chmod +x /app/tools/iso2god

EXPOSE 3000

CMD ["node", "server.js"]
