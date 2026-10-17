FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY packages ./packages
COPY apps/api ./apps/api
COPY services/lang-gateway ./services/lang-gateway
COPY apps/web ./apps/web
COPY backend ./backend
COPY frontend/website ./frontend/website
RUN npm ci --prefix frontend/website --ignore-scripts
RUN npm run build
FROM node:22-bookworm-slim
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8787
WORKDIR /app
COPY --from=build /app/dist ./dist
USER node
EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "fetch('http://127.0.0.1:8787/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node","dist/api.mjs"]
