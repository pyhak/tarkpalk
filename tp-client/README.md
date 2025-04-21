# 💻 tp-client

React + Vite front-end rakendus, mis võimaldab kasutajatel otsida ameteid ja tegevusalasid, vaadata palgaandmeid ning saada AI kokkuvõte prognoosiga.

## 🚀 Käivitamine lokaalselt

### 1. Paigalda sõltuvused
```bash
cd tp-client
npm install
```

### 2. Loo `.env` fail (või `.env.local`)
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Käivita arendusserver
```bash
npm run dev
```

## 🐳 Docker (via docker-compose)

Kui kasutad `docker-compose.yml`, siis front käivitatakse automaatselt:
```bash
docker-compose up --build
```

Avaneb: [http://localhost:5173](http://localhost:5173)

## 📁 Struktuur
```
src/
├── components/     # UI komponendid
├── services/       # API utiliidid (fetch)
├── classes/        # Tüübid (nt SalaryEntry)
├── hooks/          # Kohandatavad hookid
├── styles.ts       # MUI styled komponendid
└── App.tsx         # Põhiloogika ja layout
```

## 🧠 Tehnoloogiad
- Vite + React + TypeScript
- MUI (Material UI)
- Responsive kaartide paigutus
- OpenAI tekstide kuvamine koos vormindusega

## 📌 Tähtis
- Palgaandmed ja AI vastus saabuvad back-endist (`tp-api`)
- Rakendus eeldab, et API on töös ja ligipääsetav aadressilt `VITE_API_BASE_URL`
