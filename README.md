# TODO App with NestJS, Prisma, and MySQL

This project is a simple TODO application built with **NestJS**, **Prisma**, and **MySQL**. It includes basic authentication and a TODO management system.

## Getting Started

### Prerequisites

Ensure you have the following tools installed:
- **Node.js** (v16 or higher)
- **MySQL** (local instance or Docker)
- **npm** 
- **Git**

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rafayeljamalyandev/Interview-ToDo-App.git
```

2.	Install dependencies:
```bash
npm install
```

3.	Set up the .env file:
```bash
DATABASE_URL="mysql://root:password@localhost:3306/todoapp"
JWT_SECRET="some_secret_key"
```

4.	Apply Prisma migrations:

```bash
npx prisma migrate dev
```


5.	Start the application:
```bash
npm run start:dev
```