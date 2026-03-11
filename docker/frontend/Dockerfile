FROM node:22-alpine

WORKDIR /app

# Ferramentas básicas
RUN apk add --no-cache bash

# Mantém compatibilidade com libs que esperam glibc às vezes (opcional):
# RUN apk add --no-cache libc6-compat

EXPOSE 5173