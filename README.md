# 📝 Todo App

Welcome to the **Todo App**! This project is built with the powerful [NestJS](https://nestjs.com/) framework and incorporates Prisma for database interactions, JWT for authentication, and a host of other modern tools to create a robust backend API. 🚀

## 🌟 Features

- 🔐 **Authentication**: Secure login and signup with JWT.
- 📚 **Swagger API Docs**: Auto-generated documentation for the API.
- 📦 **Prisma ORM**: Smooth integration with the database.
- 📜 **Validation**: Input validation with `class-validator`.
- 🔧 **Scalable Structure**: Built with modularity and scalability in mind.
- ✅ **Tests**: Comprehensive unit and e2e tests with Jest.

---

## 🛠️ Getting Started

### 1️⃣ Prerequisites

Ensure you have the following installed:

- **Node.js** (v18+)
- **npm** or **yarn**
- **Docker** (for database setup with MySQL & nest running on docker container)

### 2️⃣ Clone the Repository

```bash
$ git clone https://github.com/<your-repo>/todo-app.git
$ cd todo-app
```

### 3️⃣ Install Dependencies

```bash
$ npm install
```

### 4️⃣ Environment Setup

Create a `.env` file in the root of the project with the following variables:

```env
DATABASE_URL="mysql://root:yourRootPassword@localhost:3306/yourDatabaseName?allowPublicKeyRetrieval=true&useSSL=false"
MYSQL_ROOT_PASSWORD=yourRootPassword
MYSQL_DATABASE=yourDatabaseName
MYSQL_USER=yourUsername
MYSQL_PASSWORD=yourUserPassword

# API Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET="superSecretSauce123!"
JWT_EXPIRATION=24h

```

### 5️⃣ Run the Application

#### Development Mode

```bash
$ npm run start:dev
```

#### Production Mode

```bash
$ npm run build
$ npm run start:prod
```

### 6️⃣ Access the Application

- **API**: [http://localhost:3000](http://localhost:3000)
- **Swagger Docs**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 🐳 Docker Setup

### Start the App with Docker Compose

```bash
$ docker-compose up --build
```

### Stop the App

```bash
$ docker-compose down
```

---

## 🧪 Testing

Run tests with Jest:

- **Unit Tests**:
  ```bash
  $ npm run test
  ```
- **Watch Mode**:
  ```bash
  $ npm run test:watch
  ```
- **End-to-End Tests**:
  ```bash
  $ npm run test:e2e
  ```
- **Coverage**:
  ```bash
  $ npm run test:cov
  ```

---

## 📜 Scripts

Here are some of the available npm scripts:

| Script        | Description                                |
| ------------- | ------------------------------------------ |
| `start`       | Starts the application in production mode. |
| `start:dev`   | Starts the application in watch mode.      |
| `start:debug` | Starts the application in debug mode.      |
| `build`       | Builds the application.                    |
| `test`        | Runs unit tests.                           |
| `test:e2e`    | Runs end-to-end tests.                     |
| `test:cov`    | Generates test coverage report.            |
| `lint`        | Lints the project files.                   |
| `format`      | Formats the codebase using Prettier.       |

---

## 📚 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)

- **Database ORM**: [Prisma](https://www.prisma.io/)

- **Authentication**: [JWT](https://jwt.io/) & [Passport.js](http://www.passportjs.org/)

- **Validation**: [class-validator](https://github.com/typestack/class-validator)

- **Testing**: [Jest](https://jestjs.io/);

-

---

## 💡 Directory Structure

```plaintext
📂 src
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├──📂 auth
│   ├── auth.controller.ts
│   ├── auth.integration.spec.ts
│   ├── auth.module.ts
│   ├── auth.service.spec.ts
│   ├── auth.service.ts
│   ├──📂 dto
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├──📂 guards
│   │   └── jwt-auth.guard.ts
│   └──📂 strategies
│       └── jwt.strategy.ts
├── 📂common
│   ├──📂 decorators
│   │   └── get-user.decorator.ts
│   └──📂 interfaces
│       └── jwt-payload.interface.ts
├── main.ts
├──📂 middlewares
│   └── response.error.interceptor.ts
├──📂 prisma
│   ├── prisma.module.ts
│   └── prisma.service.ts
├──📂 todos
│   ├──📂 dto
│   │   ├── create-todo.dto.ts
│   │   ├── todo.dto.ts
│   │   └── update-todo.dto.ts
│   ├── todos.controller.ts
│   ├── todos.integration.spec.ts
│   ├── todos.module.ts
│   ├── todos.service.spec.ts
│   └── todos.service.ts
└──📂 utils
    └── build-pagination-response.ts
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit PRs to improve this project. 🚀

---

## 🛡️ License

This project is licensed under the **UNLICENSED** license.

---

## ✨ Author

**Zaid Selmi**

---

## 🖼️ Screenshots


---

Made with ❤️ by [Zaid Selmi](https://github.com/zaid4kspr).

