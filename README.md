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
git clone https://github.com/nicoaudy/Interview-ToDo-App.git
```

2.	Install dependencies:
```bash
npm install
```

3.	Start database:
```bash
docker compose up -d
```

4.	Set up the .env file:
```bash
# cp .env.example .env

DATABASE_URL="mysql://todo:password@localhost:3307/todoapp"
JWT_SECRET="some_secret_key"
```

5.	Apply Prisma migrations:

```bash
npx prisma migrate dev
```

6.	Start the application:
```bash
npm run start:dev
```
