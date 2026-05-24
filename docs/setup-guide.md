# Setup Guide

## 1. Using Docker Compose (Recommended)

Make sure you have Docker and Docker Compose installed.

1. Navigate to the `steam-loss-app` directory.
2. Run the application:
   ```bash
   docker-compose up --build
   ```
3. Open your browser:
   - Frontend: `http://localhost:3000`
   - Backend API Docs (Swagger): `http://localhost:8000/docs`

## 2. Local Development

If you want to run the services separately without Docker:

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 3. Kubernetes Deployment
To deploy to Kubernetes, you would create a `Deployment` and `Service` for both frontend and backend.
Set the `VITE_API_URL` build argument in the frontend Dockerfile to point to the backend service.
