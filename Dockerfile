# Dockerfile – Node.js (Express) API jaoks
FROM alpine:3.20

# Node.js versioon
ENV NODE_VERSION=23.11.0

# Paigalda Node.js (kasutame NodeSource või apk + curl)
RUN apk add --no-cache nodejs npm

# Töökataloog
WORKDIR /app

# Kopeerime package.json ja package-lock.json
COPY package*.json ./

# Installime ainult tootmissõltuvused
RUN npm install --production

# Kopeerime kogu rakenduse
COPY . .

# Avame pordi
EXPOSE 3000

# Käivitame serveri
CMD ["node", "dist/index.js"]