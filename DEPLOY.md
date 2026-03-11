# Deploy — spndly-frontend

## Arquivos criados

### `Dockerfile.prod`

Multi-stage build: Node 20 compila o app, Nginx serve os estáticos.

As variáveis `VITE_*` são passadas como build args porque o Vite as injeta no bundle em build time — não funcionam em runtime.

```dockerfile
FROM node:20-alpine AS build

ARG VITE_API_URL
ARG VITE_API_BASE_URL
ARG VITE_OAUTH_CLIENT_ID
ARG VITE_OAUTH_CLIENT_SECRET
ARG VITE_OAUTH_GRANT_TYPE

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_OAUTH_CLIENT_ID=$VITE_OAUTH_CLIENT_ID
ENV VITE_OAUTH_CLIENT_SECRET=$VITE_OAUTH_CLIENT_SECRET
ENV VITE_OAUTH_GRANT_TYPE=$VITE_OAUTH_GRANT_TYPE

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

### `nginx.conf`

Serve a SPA com fallback para `index.html` e faz proxy reverso para o backend (necessário porque o `oauthApi` usa `baseURL: ''` e depende de proxy para `/oauth/`).

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location /api/ {
        proxy_pass https://api.pedroduarte.cloud;
        proxy_set_header Host api.pedroduarte.cloud;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_ssl_server_name on;
    }

    location /oauth/ {
        proxy_pass https://api.pedroduarte.cloud;
        proxy_set_header Host api.pedroduarte.cloud;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_ssl_server_name on;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

### `.dockerignore`

```
node_modules
dist
.git
.vscode
.env
.env.*
*.md
```

---

### `VERSION`

```
1.0.0
```

Incrementado automaticamente pelo workflow a cada push na `main`.

---

### `.github/workflows/deploy.yml`

Dispara no push para `main`. Incrementa a versão, builda a imagem Docker e pusha pro Docker Hub.

```yaml
name: Build and Push to Docker Hub

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Bump and push version
        id: version
        run: |
          git config user.name "github-actions"
          git config user.email "github-actions@github.com"
          git pull --rebase origin main
          VERSION=$(cat VERSION)
          IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"
          NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"
          echo "$NEW_VERSION" > VERSION
          echo "tag=$NEW_VERSION" >> $GITHUB_OUTPUT
          git add VERSION
          git commit -m "chore: bump version to $NEW_VERSION"
          git push

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          file: Dockerfile.prod
          push: true
          tags: |
            ${{ secrets.DOCKERHUB_USERNAME }}/spndly-frontend:latest
            ${{ secrets.DOCKERHUB_USERNAME }}/spndly-frontend:${{ steps.version.outputs.tag }}
          build-args: |
            VITE_API_URL=${{ secrets.VITE_API_URL }}
            VITE_API_BASE_URL=${{ secrets.VITE_API_BASE_URL }}
            VITE_OAUTH_CLIENT_ID=${{ secrets.VITE_OAUTH_CLIENT_ID }}
            VITE_OAUTH_CLIENT_SECRET=${{ secrets.VITE_OAUTH_CLIENT_SECRET }}
            VITE_OAUTH_GRANT_TYPE=password
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## Secrets no GitHub

Configurar em **Settings > Secrets and variables > Actions**:

| Secret | Exemplo |
|--------|---------|
| `DOCKERHUB_USERNAME` | `pedroduarte` |
| `DOCKERHUB_TOKEN` | Access token gerado no Docker Hub |
| `VITE_API_URL` | `https://api.pedroduarte.cloud` |
| `VITE_API_BASE_URL` | `/api/v1` |
| `VITE_OAUTH_CLIENT_ID` | `019ca030-ebb7-...` |
| `VITE_OAUTH_CLIENT_SECRET` | `IXuuov4zTP26N3...` |

---

## Stack no Portainer

Criar como **stack** no Portainer com Traefik:

```yaml
version: "3.6"

services:
  frontend:
    image: SEU_USUARIO/spndly-frontend:latest
    restart: unless-stopped
    networks:
      - network_public
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      labels:
        - traefik.enable=true
        - traefik.http.routers.spndly-frontend.rule=Host(`spndly.pedroduarte.cloud`)
        - traefik.http.routers.spndly-frontend.entrypoints=websecure
        - traefik.http.routers.spndly-frontend.priority=1
        - traefik.http.routers.spndly-frontend.tls.certresolver=letsencryptresolver
        - traefik.http.routers.spndly-frontend.service=spndly-frontend
        - traefik.http.services.spndly-frontend.loadbalancer.server.port=80
        - traefik.http.services.spndly-frontend.loadbalancer.passHostHeader=true

networks:
  network_public:
    name: network_public
    external: true
```

> **Nota:** Não precisa de env vars no Portainer — as variáveis `VITE_*` já foram injetadas no build pela GitHub Action.

---

## Fluxo

```
push na main
  → GitHub Action dispara
  → Incrementa VERSION (1.0.0 → 1.0.1)
  → Build Docker com VITE_* como build args
  → Push para Docker Hub (:latest + :1.0.1)
  → Portainer puxa a imagem (manual ou webhook)
  → Traefik roteia spndly.pedroduarte.cloud → container:80
  → Nginx serve SPA + proxy /api/ e /oauth/ → api.pedroduarte.cloud
```
