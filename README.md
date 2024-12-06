# TODO App with NestJS, Prisma, and MySQL

This project is a simple TODO application built with **NestJS**, **Prisma**, and **MySQL**. It includes basic authentication and a TODO management system.

## 📋 Features

- **Authentication**: JWT-based authentication for secure login and API protection.
- **User Management**: Registration, login, and user data management.
- **Task Management**: CRUD operations for tasks.
- **Prisma ORM**: For interacting with the MySQL database.

## Requirements
Ensure you have the following tools installed:

- **Docker** 

### Installation



Start the application using Docker:

```bash
docker-compose up --build
````

End-to-End tests run: 

```bash
docker-compose exec app npm run test:e2e
```
### Postman

A Postman collection is available in the `documentation/api` folder. To test the API, follow these steps:

1. Navigate to the `documentation/api` folder  project.
2. Open the Postman application.
3. In Postman, click on **Import** in the top-left corner.
4. Select the **Folder** tab and navigate to the `documentation/api` folder.
5. Select the collection file and click **Open**.
6. Once the collection is imported, you can start testing the API endpoints.

Ensure that your application is running locally or through Docker before sending requests via Postman.
