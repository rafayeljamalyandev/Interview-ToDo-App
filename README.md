
# 🚀 NestJS Todo API

A robust RESTful API built with NestJS, Prisma, and PostgreSQL for managing tasks (todos) with JWT authentication.

---

## ✨ Features

- 🔐 JWT Authentication
- 📝 Complete Todo CRUD
- 📊 Statistics and reports
- 🔍 Advanced search and filtering
- 📅 Due date management
- 📱 Pagination and sorting
- 📚 Swagger documentation
- 🎯 Robust error handling
- ✅ Data validation

---

## 🛠️ Technologies

- **NestJS** - Backend framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **Swagger** - API documentation
- **JWT** - Authentication
- **Class Validator** - Data validation

---

## 🚦 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

---

## 🏗️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <project-name>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your settings:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
   JWT_SECRET="your-super-secret-key"
   JWT_EXPIRATION="24h"
   ```

4. **Run Prisma migrations**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the server**

   ```bash
   npm run start:dev
   ```

---

## 📚 Project Structure

```plaintext
src/
├── auth/          # Authentication
│   ├── dto/       # Data Transfer Objects
│   ├── guards/    # Authentication guards
│   └── strategies/ # Passport strategies
├── common/        # Shared utilities
│   ├── decorators/ # Custom decorators
│   ├── filters/    # Exception filters
│   └── interfaces/ # Common interfaces
├── prisma/        # Prisma configuration
│   ├── migrations/ # Database migrations
│   └── schema.prisma # Prisma schema
├── todos/         # Todos module
│   ├── dto/       # Todo DTOs
│   ├── entities/  # Entities
│   └── interfaces/ # Interfaces
├── users/         # Users module
├── app.module.ts  # Main module
└── main.ts        # Entry point
```

---

## 🔑 Authentication

The API uses JWT for authentication. To obtain a token:

1. **User Registration**

   ```http
   POST /auth/register
   ```

   Request Body:

   ```json
   {
     "email": "user@example.com",
     "password": "password123",
     "name": "Example User"
   }
   ```

2. **Login**

   ```http
   POST /auth/login
   ```

   Request Body:

   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

3. **Using the Token**

   Include the token in the `Authorization` header:

   ```http
   Authorization: Bearer <your-token>
   ```

---

## 📡 Endpoints

### Auth

- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get profile

### Todos

- `GET /todos` - List todos
- `POST /todos` - Create todo
- `GET /todos/:id` - Get todo
- `PATCH /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo
- `GET /todos/stats/summary` - Get statistics
- `GET /todos/due-soon` - Get due soon todos

---

## 🔍 Search Features

Todos can be filtered by:

```http
GET /todos?search=project&completed=false&page=1&limit=10&sortBy=dueDate&sortOrder=desc
```

Available parameters:

- `search`: Search in title and description
- `completed`: Completion status (true/false)
- `page`: Page number
- `limit`: Items per page
- `sortBy`: Sort field (createdAt, dueDate, title)
- `sortOrder`: Sort order (asc/desc)

---

## 📊 Statistics

```http
GET /todos/stats/summary
```

Response:

```json
{
  "total": 10,
  "completed": 5,
  "pending": 5,
  "dueSoon": 2,
  "completionRate": 50
}
```

---

## 🛡️ Validations

- Unique titles per user
- Valid due dates
- Todo limit per user (100)
- Todo ownership validation
- Valid email format
- Secure password (minimum 6 characters)

---

## 📝 Swagger Documentation

Complete documentation is available at:

[http://localhost:3000/api](http://localhost:3000/api)

Features:

- Interactive documentation
- Endpoint testing
- Data schemas
- Integrated authentication

---

## 🧪 Testing

- **Unit tests:**

   ```bash
   npm run test
   ```

- **E2E tests:**

   ```bash
   npm run test:e2e
   ```

- **Test coverage:**

   ```bash
   npm run test:cov
   ```

---

## 🔧 Available Scripts

- `npm run start` - Start in production
- `npm run start:dev` - Start in development
- `npm run build` - Build the project
- `npm run format` - Format code
- `npm run lint` - Run linter

---

## 🤝 Contributing

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 👥 Authors

- **Rafayel Yamalyan** - *Initial Work* - [Rafayel Yamalyan](https://github.com/rafayeljamalyandev)
- **CAlexanderAC** - *Technical Test* - [CAlexanderAC](https://github.com/calexanderac)

---

## 🙏 Acknowledgments

- NestJS Team
- Prisma Team
- All contributors

---

⌨️ with ❤️ by [CAlexanderAC](https://github.com/calexanderac)
