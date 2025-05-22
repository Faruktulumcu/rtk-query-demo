# RTK Query Demo

A simple fullstack demo app to manage books and reviews.

Frontend is built with Vite, React, and Redux Toolkit Query.

Backend is a Kotlin Spring Boot API with in-memory storage.

## Project Description

This is a demo book-tracking app with three users: **alice**, **bob**, and **carol**. Each user has a personal collection of favorite books.

### Core Features

- **User Books**
    - Each user has their own books.
    - Users can search and add books via the **Google Books API**.

- **Home Page**
    - Lists user’s books (fetched from backend).
    - Search bar to find books from Google.
    - Adding a book triggers a re-fetch.

- **Book Detail Page**
    - Shows book details.
    - Users can add **private** or **public** reviews.
    - Fetches:
        - Book detail
        - User’s reviews
        - Public reviews from others (with 5s polling)

- **Reviews**
    - Users can **Create**, **Read**, **Update**, and **Delete** their own reviews.
    - Public reviews are visible to other users (not the author).


## RTK Query Features (Technical Specs)

- **Data Fetching**
    - `GET /api/books` – fetches user’s books on home page.
    - `GET /api/books/:id` – fetches book details.
    - `GET /api/books/:id/reviews` – fetches user’s reviews.
    - `GET /api/books/:isbn/public-reviews` – fetches public reviews (with 5s polling).

- **Mutations**
    - `POST /api/books` – adds a new book.
    - `POST /api/books/:id/reviews` – creates a new review.
    - `PUT /api/books/:bookId/reviews/:reviewId` – updates a review.
    - `DELETE /api/books/:bookId/reviews/:reviewId` – deletes a review.
    - `POST /api/login` – user login.

- **Caching & Invalidation**
    - Cache tags ensure automatic refetch after mutations.
    - Adding a book invalidates the book list.
    - Updating/deleting a review invalidates the review list.

- **Polling**
    - Public reviews are automatically polled every **5 seconds**.

- **Authorization**
    - All endpoints (except login) require a bearer token in headers.

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
npm run msw:init
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
npm run dev:api
```

Make sure frontend uses `.env.api` to point to backend.

---

This project is for demonstration and development purposes.
