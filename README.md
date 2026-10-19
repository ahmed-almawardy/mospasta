# Restaurant Welcome Page — Next.js + FastAPI

A responsive restaurant landing page inspired by the reference photo. The visual style uses warm parchment colors, deep olive green, terracotta accents, olive-branch details and a food photo cropped from the provided reference. The English and Arabic menu buttons call the FastAPI backend and display menu data returned by the API.

## Project structure

```text
restaurant-starter/
├── frontend/                 # Next.js App Router frontend
│   ├── app/
│   │   ├── page.jsx           # Landing page + API calls + menu view
│   │   ├── layout.jsx
│   │   └── globals.css
│   ├── public/mediterranean-table.jpg
│   ├── package.json
│   └── .env.local.example
├── backend/
│   ├── main.py                # FastAPI app and sample bilingual menu
│   └── requirements.txt
└── README.md
```

## Requirements

- Node.js 20.9 or newer and npm
- Python 3.10 or newer

## Run on Ubuntu / Linux

Open **two terminal windows** from the project folder.

### 1. Start FastAPI

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Check the API in your browser:

- Health: <http://127.0.0.1:8000/api/health>
- Restaurant config: <http://127.0.0.1:8000/api/restaurant>
- English menu: <http://127.0.0.1:8000/api/menu/en>
- Arabic menu: <http://127.0.0.1:8000/api/menu/ar>
- Interactive API docs: <http://127.0.0.1:8000/docs>

### 2. Start Next.js

In a second terminal, from the project root:

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Then open <http://localhost:3000>.

The frontend reads `NEXT_PUBLIC_API_BASE_URL` from `frontend/.env.local`. When both apps run on the same computer, keep it set to `http://127.0.0.1:8000`. Restart the Next.js development server after changing this value.

## API routes

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/health` | Confirms that the API is running |
| `GET` | `/api/restaurant` | Returns brand text and social-media links |
| `GET` | `/api/menu/en` | Returns the English menu |
| `GET` | `/api/menu/ar` | Returns the Arabic menu |

CORS allows the local Next.js development origins on port `3000`. For deployment, set `CORS_ORIGINS` to your actual frontend origin(s), separated by commas.

## Customize for your restaurant

- Change the restaurant name with the backend environment variable `RESTAURANT_NAME`.
- Change social profile destinations with `FACEBOOK_URL`, `INSTAGRAM_URL`, and `TIKTOK_URL`.
- Edit the sample food, descriptions and prices in `backend/main.py`.
- Replace `frontend/public/mediterranean-table.jpg` with your own licensed restaurant photography. Keep the same filename or update the CSS background URL in `frontend/app/globals.css`.
- Adjust the design colors and spacing in `frontend/app/globals.css`.

The sample items and prices are demonstration content. Update them before publishing the page for a real restaurant.

## Production notes

Run `npm run build` then `npm run start` in `frontend` for the Next.js production build. Run FastAPI behind a production ASGI server or your platform's recommended process manager. Configure the public `NEXT_PUBLIC_API_BASE_URL` to point at the deployed HTTPS API, and configure FastAPI CORS to permit your deployed frontend origin.
