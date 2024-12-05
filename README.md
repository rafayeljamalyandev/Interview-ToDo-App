# ToDo Backend Project

This project is a simple TODO application built with **NestJS**, **Prisma**, and **MySQL**. It provides basic functionality for managing TODO items and user authentication.

## Project Structure

The project is organized into the following directories:

- `dist/`: Compiled files (generated after build).
- `documentation/`: API documentation and related files.
- `docker-compose.yml`: Docker configuration file to run MySQL.
- `node_modules/`: Installed npm packages.
- `prisma/`: Prisma database schema and migration files.
- `src/`: Source code of the application.
- `test/`: End-to-end tests for the application.
- `Makefile`: Utility for running various development tasks.
- `package.json`: Project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration for the project.

---

## Getting Started

### Prerequisites

Before running the project, ensure you have the following tools installed:

- **Node.js** (v16 or higher)
- **Docker** and **Docker Compose**
- **npm**

### 1. Setting Up MySQL Using Docker

To run MySQL in a Docker container, follow these steps:

1. **Modify `docker-compose.yml` to set the appropriate MySQL credentials**:
   
   Open the `docker-compose.yml` file and ensure that the `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, and `MYSQL_PASSWORD` values are set correctly. Here's an example:

   ```yaml
   version: '3.8'

   services:
     db:
       image: mysql:8.0
       container_name: mysql_todo
       restart: always
       ports:
         - "3306:3306"
       environment:
         MYSQL_ROOT_PASSWORD: rootpassword
         MYSQL_DATABASE: todoapp
         MYSQL_USER: user
         MYSQL_PASSWORD: userpassword
       volumes:
         - db_data:/var/lib/mysql

   volumes:
     db_data:
   ```

2. **Start MySQL using Docker Compose**:
   
   Once the configuration is set, run the following command to start the MySQL container:

   ```bash
   docker-compose -d up
   ```

   This will start MySQL and expose it on `localhost:3306`.

---

### 2. Configuring Environment Variables

Create a `.env` file in the root directory of the project with the following content:

```bash
DATABASE_URL="mysql://root:rootpassword@localhost:3306/todoapp"
JWT_SECRET="some_secret_key"
PORT=3000
```

Make sure to replace the database connection information with your actual settings.

---

### 3. Installing Dependencies

To install the required dependencies for the project, run the following command:

```bash
npm install
```

---

### 4. Running Migrations

Prisma is used for database management. To apply the migrations and set up the database schema, run:

```bash
npx prisma migrate dev
```

---

### 5. Running the Application

Once the database is set up and dependencies are installed, you can start the application with:

```bash
npm run start:dev
```

This will start the NestJS server, and the application will be accessible at `http://localhost:3000`.

---

## Makefile Commands

The project includes a `Makefile` for common development tasks. Here are some key commands:

- **Run migrations**:

   This will run Prisma migrations to update the database schema:

   ```bash
   make migrations
   ```

- **Test database connection**:

   This command pulls the database schema to ensure it is connected properly:

   ```bash
   make test_db_connect
   ```

- **Run end-to-end tests**:

   To run the tests, use the following command:

   ```bash
   make run_tests
   ```

---

## Running Tests

The project uses end-to-end tests to validate the application. To run the tests, use:

```bash
npm run test:e2e
```

Or you can use the Makefile:

```bash
make run_tests
```

---

## Folder Structure Explanation

- **src/**: Contains the source code of the application. This includes modules, controllers, services, and configuration for the application.
- **prisma/**: Holds the Prisma schema (`schema.prisma`) and migration files.
- **test/**: Contains the end-to-end tests for the application.

---

## Conclusion

This project is set up with basic functionality for a TODO application using **NestJS**, **Prisma**, and **MySQL**. The provided instructions allow you to set up MySQL in a Docker container, configure environment variables, install dependencies, apply database migrations, and run the application.

Make sure to follow the steps above to get started with the project, and feel free to modify or improve the code to better suit your needs.

Good luck! 🚀
