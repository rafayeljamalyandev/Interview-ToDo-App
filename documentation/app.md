# API Documentation

## Getting Started with Postman Collection

1. **Import the Collection**:
   - Download the `postman_collection.json` from the `/docs/api` folder or use the [Postman Public Link](https://www.postman.com/...).
   - Open Postman, go to **File > Import**, and choose the downloaded `.json` file.

2. **Authenticate**:
   - Use the `POST /auth/login` request to get the JWT token.
   - Set the token in the `Authorization` header for all subsequent requests.

3. **Running the Tests**:
   - Use the **Pre-request Scripts** and **Tests** tabs in Postman to execute and check the behavior of API requests.
   - You can run the collection using the **Collection Runner** in Postman for automated testing.

## Postman API Requests

- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Login a user and obtain the JWT token.
- **POST /todos/create**: Create a new todo.
- **GET /todos/list**: List all todos.
- **GET /todos/find/:id**: Get a todo by its ID.
- **PUT /todos/update/:id**: Update a todo.
- **DELETE /todos/delete/:id**: Delete a todo.
