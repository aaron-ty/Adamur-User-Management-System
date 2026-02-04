---

# Adamur: Secure User Management Backend

## Overview
Adamur is a modular, production-oriented backend for user management on educational platforms. 
It provides secure registration, authentication, account verification, and password reset workflows through a GraphQL API. 

The system emphasizes maintainability, security, and scalability, with explicit architectural decisions to support real-world usage.

### Key Design Highlights
- JWT-based authentication and role-based access control
- Modular GraphQL API layer for maintainable and extensible operations
- Prisma-based database modeling with migrations for reproducible schema
- Email verification and password reset workflows via configurable SMTP
- Environment-driven configuration for secure deployments

---

## Architecture
Adamur is designed as a backend-first service with clear separation of concerns:

1. **API Layer** – GraphQL mutations handle all user operations.
2. **Authentication & Security** – JWT tokens for stateless authentication, role-based access control for resource protection.
3. **Persistence Layer** – Prisma ORM with MySQL (or compatible) backend; migrations ensure consistent schema management.
4. **Email Layer** – SMTP integration for account verification and password reset notifications.
5. **Environment Config** – All credentials and secrets stored in `.env` to isolate runtime configuration from code.

This design prioritizes **security, observability, and modularity** for production-grade deployments.

---

## Setup & Installation
**Prerequisites**:
- Python 3.x (for any backend scripts or utilities)
- Node.js v14+ with npm
- MySQL or compatible database
- TypeScript installed globally (`npm install -g typescript`)

**Installation**:

```bash
git clone https://github.com/yourusername/adamur-user-management.git
cd adamur-user-management
npm install
````

**Environment configuration**:

Create a `.env` file:

```env
DATABASE_URL=mysql://<username>:<password>@localhost:<port>/<database_name>
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
```

**Database setup**:

```bash
npx prisma migrate dev --name init
```

---

## Running the Backend

```bash
npm run dev
```

Server runs on `http://localhost:4000` with hot reload via `ts-node` and `nodemon`.

---

## GraphQL API Endpoints

| Mutation               | Description                                |
| ---------------------- | ------------------------------------------ |
| `registerUser`         | Creates a new user account                 |
| `loginUser`            | Authenticates a user and returns JWT token |
| `verifyAccount`        | Verifies email via token                   |
| `requestPasswordReset` | Sends password reset email                 |
| `resetPassword`        | Resets password using token                |

### Example: Register User

```graphql
mutation {
  registerUser(username: "john_doe", email: "john@example.com", password: "securepassword") {
    id
    username
    email
  }
}
```

**Response**:

```json
{
  "data": {
    "registerUser": {
      "id": "1",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

> All other mutations follow the same pattern: concise inputs and structured JSON outputs.

---

## Operational Notes

* Designed for **modular expansion**: adding roles, MFA, or analytics can be done without major refactors.
* JWT tokens are stateless; server scales horizontally with no session dependency.
* SMTP is fully configurable; supports any standard provider.
* Prisma migrations provide deterministic schema updates; suitable for CI/CD pipelines.
* All sensitive data lives in `.env`; no secrets in code.

---

## Limitations

* Not production load-tested; for educational or prototype deployments, performance is sufficient.
* Email layer assumes reliable SMTP; no retry/backoff is currently implemented.
* Password reset tokens are ephemeral; ensure secure token storage if extended.

---

## License

MIT License – see [LICENSE](LICENSE)

---
