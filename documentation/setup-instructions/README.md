# TODO App with NestJS, Prisma, and MySQL

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have the following tools installed:

- **Node.js** (v16 or higher)
- **Docker**
- **npm**
- **Git**

### Setup

#### 1. Install dependencies:

```bash
npm install
```

#### 2. Set up the .env file (see .env.example file for an example):

```bash
DATABASE_URL="DATABASE URL"
JWT_SECRET="JWT SECRET"
MYSQL_ROOT_PASSWORD="MYSQL ROOT PASSWORD"
MYSQL_DATABASE="MYSQL DATABASE"
```

#### 3. Apply Prisma migrations:

```bash
npx prisma migrate dev
```

#### 4. Run Docker container:

```bash
./manage-container.sh
```

#### 5. Start the application:

```bash
npm run start:dev
```

## 🛠️ API Documentation with Swagger

Once the development server is running, you can test the API using Swagger UI:

Navigate to: http://localhost:3000/api-docs

## 📂 Postman Collection

A Postman collection is available for testing the API. You can find the exported collection in the following location:

`./documentation/api/Todo-App.postman_collection.json`

Import this collection into Postman to test all API endpoints.

## 🧪 Running Tests

For testing, you can run both unit tests and end-to-end integration tests for the application, including the auth and todos services.

To run all tests, execute the following command:

```bash
npm test
```

This will run all unit and integration tests and display the results in the terminal.

## 📌 Notes

- Ensure Docker is running before using the manage-container.sh script.
- To customize the Prisma schema, edit the prisma/schema.prisma file and reapply migrations.
