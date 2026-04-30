# Gorga Shop Demo

This repository contains a full-stack demo app with a React + Vite frontend and an Express backend.

## Run the demo

1. Start the backend:
   ```bash
   cd completed_backend
   npm install
   npm run dev
   ```
   The backend runs on `http://localhost:3000`.

2. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend runs on Vite, typically at `http://localhost:5174`.

3. Open the app in your browser:
   ```text
   http://localhost:5174/products
   ```

## Notes

- The frontend uses the backend API at `http://localhost:3000`.
- Product images are served from backend static assets.
- If `localhost:5174` is not available, Vite may select the next available port.
