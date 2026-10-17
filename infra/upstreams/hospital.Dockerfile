FROM node:22-bookworm-slim
WORKDIR /original
COPY hackshift/projects/project-1/package*.json ./
RUN npm ci --ignore-scripts
COPY hackshift/projects/project-1/ ./
EXPOSE 5173
CMD ["npm","run","dev","--","--host","0.0.0.0","--port","5173"]
