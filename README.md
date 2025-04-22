# 💼 Palgaotsing

**Palgaotsing** on täislahendus, mis võimaldab leida palgaandmeid ametite ja tegevusalade lõikes ning näha AI abil loodud prognoosi. Projekt koosneb kahest osast:

- 🧠 `tp-api/` – Node.js back-end + OpenAI integratsioon
- 💻 `tp-client/` – React + MUI kasutajaliides

---

## ⚛️ Kiirelt käima (Docker Compose)

1. Klooni projekt:
```bash
git clone https://github.com/pyhak/tarkpalk.git
cd tarkpalk
```

2. Loo `.env` fail projekti juurkausta:
```env
OPENAI_API_KEY=siia_sinu_openai_voti
```

3. Käivita kogu rakendus:
```bash
docker-compose up --build
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3000](http://localhost:3000)

---

## 🧠 tp-api (back-end)

Express server, mis suhtleb Statistikaametiga ning kasutab OpenAI teenust kokkuvõtete koostamiseks.

📂 Vaata lähemalt: [`tp-api/README.md`](./tp-api/README.md)

### Peamised endpointid
- `GET /occupations/search?q=`
- `GET /activities/search?q=`
- `GET /occupations/activity-from-occupation/:code`
- `POST /salary`
- `POST /api/summary`

---

## 💻 tp-client (front-end)

React + Vite kasutajaliides, mille kaudu saab otsida ameteid ja tegevusalasid, kuvada palgaandmeid ja näha AI poolt vormindatud prognoosi.

📂 Vaata lähemalt: [`tp-client/README.md`](./tp-client/README.md)

### Funktsionaalsus
- Ameti või tegevusala valik (otsi ja vali)
- Palgaandmete kuvamine ajas
- AI kokkuvõte ja soovitused
- Responsive kujundus

---

## ⚙️ Arendus eraldi

### API:
```bash
cd tp-api
npm install
npm run dev
```

### Client:
```bash
cd tp-client
npm install
npm run dev
```

---

## 📌 Tehnoloogiad
- Node.js + Express + TypeScript
- React + Vite + MUI
- OpenAI GPT-4 API
- Statistikaameti PA103 + ISCO/EMTAK klassifikaator

---

## 📁 Projektistruktuur
```
projekt/
├── tp-api/            # Back-end (Express + OpenAI)
│   └── src/
├── tp-client/         # Front-end (React + MUI)
│   └── src/
├── docker-compose.yml
├── Dockerfile         # API jaoks
└── README.md
```
🧪 Märkus: ISCO-EMTAK vastendamine on prototüübiline ning mõeldud ainult testimiseks. Täielikku klassifikaatori katvust ja ametlikku loogikat ei ole implementeeritud.

🎯 Loodud Äripäevale proovitööks.

