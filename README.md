# Todos App

This is a NestJS application with a microservices' architecture.

## Development Environment

- **OS**: Windows 11
- **Node.js**: 22.12
- **pnpm**: 9.9

## Installation

1. Install dependencies:
    ```sh
    pnpm i
    ```

2. Adjust `DATABASE_URL` username and password to your credentials in the environment configuration.

3. Generate Prisma client:
    ```sh
    pnpm run prisma-generate
    ```

4. Run database migrations:
    ```sh
    pnpm run migration
    ```

## Running Services

- Start the main service in development mode:
    ```sh
    pnpm run start:dev
    ```

- Start the auth service in development mode:
    ```sh
    pnpm run start:dev auth
    ```

## Testing

- Run unit tests:
    ```sh
    pnpm run test
    ```

- Run end-to-end tests for the auth service:
    ```sh
    pnpm run test:e2e:auth
    ```

- Run end-to-end tests for the todo service:
    ```sh
    pnpm run test:e2e:todo
    ```

## Project Structure

- **Services**: Located in the `apps` directory.
  - `auth`
  - `todo`

- **Common Services**: Located in the `libs` directory.
  - `prisma`
  - `logger`
  - Other shared utilities and files

## Notes

- Ensure all environment variables are properly set for each service.
- Refer to the NestJS documentation for more details on microservices setup and configuration.
