# Fullstack Hub

A fullstack web application built with React, TypeScript, Node.js, and Express. The project demonstrates frontend and backend development, authentication, database integration, API design, testing, and Docker-based deployment.

## Features

- **Authentication and authorization** — user registration, login, JWT authentication, and protected API routes.
- **Dashboard** — task management with status filters, search, and drag-and-drop.
- **Employee management** — create, view, update, and delete employee records.
- **User settings** — application preferences stored in MongoDB Atlas.
- **REST API** — Express.js backend with centralized error handling and input validation.
- **Database integration** — PostgreSQL for relational data and MongoDB for application settings.
- **Data fetching and caching** — TanStack Query.
- **Form management and validation** — React Hook Form and Zod.
- **Automated tests** — Vitest tests for backend services and API routes.
- **Code quality** — ESLint for both frontend and backend.
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

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- MongoDB Atlas
- JSON Web Tokens (JWT)

### Development Tools

- Docker
- Docker Compose
- ESLint
- Vitest
- npm

## Project Structure

```text
fullstack-hub/
├── frontend/              # React frontend
├── backend/               # Express backend and API
├── docker-compose.yml     # Application services
├── package.json           # Root-level project scripts
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

Install the following tools:

- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

Docker Desktop includes Docker Compose.

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd fullstack-hub
```

Create the backend environment file at `backend/.env` and configure all required environment variables.

The backend uses PostgreSQL through Docker Compose and connects to MongoDB Atlas for application settings. Configure any required MongoDB connection details and authentication secrets in the environment file.

Do not commit `.env` files or production credentials to the repository.

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

Docker Compose creates a persistent volume named `postgres_data` for PostgreSQL data.

### View Container Status

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

The repository includes a root-level command for running the main code quality and build checks.

From the project root, run:

```bash
npm run check
```

This command runs:

1. ESLint for the frontend.
2. ESLint for the backend.
3. Backend tests using Vitest.
4. A production build of the frontend.

The command stops if any step fails.

## Databases

### PostgreSQL

PostgreSQL stores relational application data, including employee records and other application entities managed by the backend.

The database runs as a Docker Compose service and persists data in a named Docker volume.

### MongoDB Atlas

MongoDB Atlas stores application settings.

A MongoDB Atlas account and a correctly configured connection string may be required for settings-related functionality.

## Security Notes

- JWT authentication protects restricted API routes.
- Environment variables are used for sensitive configuration.
- Do not commit secrets, access tokens, database credentials, or production environment files.
- The default PostgreSQL credentials in `docker-compose.yml` are intended for local development only. Use secure credentials and appropriate secret management for production deployments.

## Purpose

This project was developed as a fullstack learning and portfolio project to practice and demonstrate:

- React and TypeScript development.
- REST API design with Express.
- Authentication and authorization.
- Relational and document database integration.
- Form validation and server-state management.
- Automated testing and linting.
- Docker-based application setup.
