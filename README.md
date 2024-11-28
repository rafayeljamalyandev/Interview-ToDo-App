# TODO App with NestJS, Prisma, and MySQL

A simple TODO application built with NestJS, Prisma, and MySQL, featuring authentication and todo management.

> **Warning**: The `.env` file is included for demonstration **only**. In production, **never commit `.env` files to version control**.

## Prerequisites

- Node.js (v16+)
- Docker
- npm or yarn

## Local Development Setup

### 1. Environment Configuration

Create `.env` in project root:

```env
# Database
DATABASE_URL="mysql://root:password@localhost:3306/todoapp"

# JWT Settings
JWT_SECRET="your_secure_secret_key"
JWT_EXPIRATION=10h

# Server
PORT=3000
```

### 2. Database Setup

Use Docker Compose to initialize the database:

```bash
# Generate Prisma client
npx prisma generate

# Start database containers
docker-compose up -d
```

This will:

- Start MySQL database
- Create PhpMyAdmin interface
- Set up necessary network configurations

### 3. Database Migrations

Apply database migrations:

```bash
npx prisma migrate dev
```

### 4. Installation & Running

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run start:dev
```

## API Endpoints

### Authentication

- `POST /auth/login`: User login
- `POST /users`: User registration

### Todos

- `GET /todos`: List todos
- `POST /todos`: Create todo

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Documentation

API documentation available in `documentation/api/todo-app.postman_collection.json`

### Postman Setup

1. Create new Environment:

   - Click "Environments" -> "Create Environment"
   - Name: "Todo App Local"
   - Add variable: `baseUrl` = `http://localhost:3000`
   - Save environment

2. Import Collection:

   - Import `documentation/api/todo-app.postman_collection.json`
   - Select "Todo App Local" environment from dropdown (top-right)

3. Test API Flow:
   - Register: POST {{baseUrl}}/users
   - Login: POST {{baseUrl}}/auth/login
   - Create Todo: POST {{baseUrl}}/todos
   - List Todos: GET {{baseUrl}}/todos

Note: The login endpoint sets cookies automatically for subsequent authenticated requests.
