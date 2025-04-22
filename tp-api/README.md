# 🧠 tp-api

Back-end teenus, mis pakub palgaandmete päringut ISCO/EMTAK koodide alusel ning kasutab OpenAI teenust kokkuvõtte genereerimiseks.

## ⚛️ Käivitamine lokaalselt

### 1. Paigalda sõltuvused
```bash
cd tp-api
npm install
```

### 2. Loo `.env` fail
```env
OPENAI_API_KEY=siia_sinu_openai_voti
```

### 3. Käivita arendusserver
```bash
npm run dev
```

### 4. Ehita ja käivita buildist
```bash
npm run build
node dist/index.js
```

## 💡 Testimine

Projekt kasutab `Jest` ja `Supertest` testimiseks.

### Testide käivitamine:
```bash
npm test
```

### Koodikattuvuse raport:
```bash
npm run test:coverage
```

## 🐳 Docker
```bash
docker-compose up --build
```
See kasutab `OPENAI_API_KEY` väärtust `.env` failist.

## 🛠️ Endpointid
- `GET /occupations/search?q=`
- `GET /activities/search?q=`
- `GET /occupations/activity-from-occupation/:code`
- `POST /salary`
- `POST /api/summary`

## 📁 Struktuur
```
src/
├── routes/       # API endpointid
├── services/     # OpenAI ja Statistikaameti päringud
├── utils/        # Andmetöötlus, ISCO loader, mapper
├── config.ts     # URL-konstandid
└── index.ts      # Entry point
```
📌 Märkus: `ISCO → EMTAK` vastendust kasutatakse testotstarbel. Tegemist on lihtsustatud prototüübiga, mis ei kajasta kõiki klassifikaatori reegleid ega hierarhiaid.

