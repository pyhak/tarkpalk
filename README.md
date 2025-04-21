# 💼 Palgaotsing

**Palgaotsing** on veebirakendus, mis võimaldab kasutajatel leida palgaandmeid ametite ja tegevusalade lõikes ning näha AI-põhist prognoosi tuleviku kohta.

## 🚀 Tehnoloogiad

- React + TypeScript + Vite
- MUI (Material UI) komponentide raamistik
- Node.js + Express back-end
- OpenAI GPT-4 API kokkuvõtete genereerimiseks
- Statistikaameti andmed (ISCO & EMTAK)

## 🧰 Projektistruktuur

```
├── public/
│   └── logo.svg                # Logo ja favicon
├── src/
│   ├── components/             # Dropdownid ja formatter
│   ├── services/
│   │   └── fetch.ts            # API päringute utiliidid
│   ├── classes/
│   │   └── types.ts           # Tüübid (nt SalaryEntry, Option)
│   ├── styles.ts              # Styled komponendid (Card, Layout)
│   ├── App.tsx                # Põhikomponent
│   └── App.css                # Üldine stiil
```

## 📦 Paigaldamine ja käivitamine (lokal)

1. **Klooni repo**
```bash
git clone <repo-url>
cd palgaotsing
```

2. **Paigalda sõltuvused**
```bash
npm install
```

3. **Loo .env fail**
```bash
cp .env.example .env
```

`.env` sisu:
```
VITE_API_BASE_URL=http://localhost:3000
OPENAI_API_KEY=...siia oma võti...
```

4. **Käivita arendusserver**
```bash
npm run dev
```

## 🐳 Docker

### Ehitamine ja käivitamine
```bash
docker-compose up --build
```

### Keskkonnamuutujad
`.env` failis peab olema:
```
OPENAI_API_KEY=...sinuvõti...
```

See fail loetakse `docker-compose.yml` kaudu automaatselt sisse.

## 🔗 API endpointid

Kliendi poolelt tehakse päringuid järgmistele endpointidele:
- `/activity-from-occupation/:code`
- `/activities/search?q=`
- `/occupations/search?q=`
- `/salary` (POST)
- `/api/summary` (POST)

## 📊 Funktsionaalsus

- Ameti või tegevusala valik (otsing + automaatne seos)
- Keskmise palgaandmete küsimine
- OpenAI abil genereeritud tekstiline prognoos
- Formatteeritud kokkuvõte pealkirjade, loendite ja rõhutustega

## 🎨 Kujundus
- Responsive layout kaardipõhiselt
- SVG logo ja ikoonid `public/` kaustas
- Tume ja hele teema tugi (vastavalt `prefers-color-scheme`)

## 📌 TODO või edasised ideed
- Graafik palgaandmete visualiseerimiseks
- Kasutajamärguanded (toasts)
- Caching
- Ühised hookid dropdownde jaoks
- Testid komponentidele

---

Made with ❤️ in Estonia
