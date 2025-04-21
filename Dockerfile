version: '3.8'

services:
  api:
    build: ./tp-api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    env_file:
      - .env
    volumes:
      - ./tp-api/data:/app/data

  client:
    build: ./tp-client
    ports:
      - "5173:5173"
    environment:
      - NODE_ENV=production
      - VITE_API_BASE_URL=http://localhost:3000
    volumes:
      - ./tp-client:/app
    command: npm run dev