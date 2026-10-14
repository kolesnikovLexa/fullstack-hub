# Fullstack Hub

A fullstack web application built with React, TypeScript, Node.js, and Express. The project demonstrates frontend and backend development, authentication, database integration, REST API design, automated testing, and containerization.

## Features

- **Authentication and authorization** — user registration, login, JWT authentication, and protected API routes.
- **Dashboard** — task management with status filters, search, and drag-and-drop.
- **Employee management** — create, view, update, and delete employee records.
- **User settings** — application preferences stored in MongoDB Atlas.
- **REST API** — Express.js backend with centralized error handling and input validation.
- **Database integration** — PostgreSQL for relational data and MongoDB for application settings.
- **Data fetching and caching** — TanStack Query.
- **Form management and validation** — React Hook Form and Zod.
- **Automated testing** — Vitest tests for frontend components, backend services, and API routes.
- **Code quality** — ESLint for frontend and backend.
- **Continuous integration** — GitHub Actions automatically runs project checks.
- **Containerization** — Docker Compose for running the application and PostgreSQL.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- Vitest
- React Testing Library

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM (Prisma 8 release candidate)
- PostgreSQL
- MongoDB Atlas
- JSON Web Tokens (JWT)
- Zod
- Vitest
- Supertest

### Development Tools

- Docker
- Docker Compose
- ESLint
- GitHub Actions
- npm

## Project Structure

```text
fullstack-hub/
├── .github/
│   └── workflows/
│       └── ci.yml
├── frontend/
├── backend/
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

Install the following tools:

- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

Docker Desktop includes Docker Compose.

Node.js and npm are also required if you want to run the project checks locally outside Docker.

### Installation

Clone the repository:

```bash
git clone https://github.com/kolesnikovLexa/fullstack-hub.git
cd fullstack-hub
```

Create the backend environment file at `backend/.env` and configure the required environment variables.

The backend uses PostgreSQL through Docker Compose and connects to MongoDB Atlas for application settings. Configure the MongoDB connection string and authentication secrets in the environment file.

Do not commit `.env` files, credentials, or production secrets to the repository.

### Start the Application

Build the Docker images and start the containers in the background:

```bash
docker compose up --build -d
```

Once the services are running, access the application at:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **PostgreSQL:** `localhost:5433`

The PostgreSQL database is named `fullstack_interview`.

Docker Compose creates a persistent volume named `frontend-dashboard_postgres_data` for PostgreSQL data.

### View Container Status

Check the status of the containers:

```bash
docker compose ps
```

View logs from all services:

```bash
docker compose logs -f
```

View logs from a specific service:

```bash
docker compose logs -f backend
```

Replace `backend` with `frontend` or `postgres` to inspect another service.

### Stop the Application

Stop and remove the containers:

```bash
docker compose down
```

The PostgreSQL data volume is preserved, so database data remains available when the application is started again.

To remove the containers and permanently delete the PostgreSQL data volume:

```bash
docker compose down -v
```

**Warning:** The `-v` option deletes the stored PostgreSQL data.

## Project Checks

The repository includes a root-level command for running the main code quality, testing, and build checks.

From the project root, run:

```bash
npm run check
```

This command runs the following checks in sequence:

1. ESLint for the frontend.
2. ESLint for the backend.
3. Frontend tests using Vitest.
4. Backend tests using Vitest.
5. A production build of the frontend.

The command stops if any step fails.

## Continuous Integration

GitHub Actions automatically runs the project checks on pushes to the `main` branch and pull requests targeting `main`.

The CI workflow:

1. Checks out the repository.
2. Sets up Node.js.
3. Installs frontend and backend dependencies.
4. Runs `npm run check`.

This verifies code quality, frontend and backend tests, and the frontend production build in the CI environment.

The workflow configuration is located in `.github/workflows/ci.yml`.

## Databases

### PostgreSQL

PostgreSQL stores relational application data, including employee records and other application entities managed by the backend.

The project uses PostgreSQL 17 through Docker Compose. The database persists data in a named Docker volume.

When running through Docker Compose, the backend connects to PostgreSQL using the internal Docker service address.

### MongoDB Atlas

MongoDB Atlas stores application settings.

A MongoDB Atlas account and a correctly configured connection string are required for settings-related functionality.

## Security Notes

- JWT authentication protects restricted API routes.
- Environment variables are used for sensitive configuration.
- Do not commit secrets, access tokens, database credentials, or production environment files.
- The default PostgreSQL credentials in `docker-compose.yml` are intended for local development only.
- Use secure credentials and appropriate secret management for production deployments.

## Purpose

This project was developed as a fullstack learning and portfolio project to practice and demonstrate:

- React and TypeScript development.
- REST API design with Express.
- Authentication and authorization.
- Relational and document database integration.
- Form validation and server-state management.
- Frontend and backend testing.
- Code quality checks and continuous integration.
- Docker-based application setup.
