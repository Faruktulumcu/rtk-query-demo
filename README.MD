# RTK Query Demo

A simple fullstack demo app to manage books and reviews.
Frontend is built with Vite, React, and Redux Toolkit Query.
Backend is a Kotlin Spring Boot API with in-memory storage.

## Project Structure

```
rtk-query-demo/
├── backend/     # Kotlin Spring Boot API
├── frontend/    # Vite + React app
└── docker-compose.yml
```

## How to Run

### 1. Run with Docker

Runs both frontend and backend using Docker Compose:

```bash
docker-compose up --build
```

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:5170/rtk-demo/api](http://localhost:5170/rtk-demo/api)
* Swagger UI: [http://localhost:5170/rtk-demo/swagger-ui/index.html](http://localhost:5170/rtk-demo/swagger-ui/index.html)

### 2. Frontend with MSW (Mock API)

```bash
cd frontend
npm install
npm run dev
```

Runs frontend with mocked API on [http://localhost:5173](http://localhost:5173)

### 3. Frontend + Backend (Local Dev)

Run backend and frontend separately without Docker.

Backend:

```bash
cd backend
./gradlew bootRun
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Make sure frontend uses `.env.api` to point to backend.

---

This project is for demonstration and development purposes.
