
---

# Adamur User Management System

## Overview

The Adamur User Management System is a modular and secure user management solution designed for educational platforms. It allows users to register, authenticate, and manage their accounts while ensuring data security and compliance with best practices.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running the Project](#running-the-project)
5. [API Endpoints](#api-endpoints)
6. [Inputs and Expected Outputs](#inputs-and-expected-outputs)
7. [License](#license)

## Getting Started

Follow the instructions below to set up and run the Adamur User Management System locally.

## Prerequisites

Before running the project, ensure you have the following installed on your machine:

- **Windows Subsystem for Linux (WSL)**
- **Python3** for setting up a virtual environment (venv)
- **Node.js** (v14 or higher)
- **npm** (Node package manager, included with Node.js)
- **TypeScript** (globally installed; you can install it using `npm install -g typescript`)
- **MySQL** (or another compatible database)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/adamur-user-management.git
   cd adamur-user-management
   ```

2. Set Up a Virtual Environment (venv)

To isolate the environment and manage dependencies:

```bash
sudo apt-get update
sudo apt-get install python3-venv
python3 -m venv venv
source venv/bin/activate
```

This will create and activate a virtual environment within your project.


3. Install the necessary dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:

   ```plaintext
   DATABASE_URL=mysql://<username>:<password>@localhost:<port>/<database_name>
   JWT_SECRET=your_jwt_secret
   SMTP_HOST=smtp.your-email.com
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASS=your-email-password
   ```

   Replace placeholders with your actual database credentials and SMTP details.

5. Set up the database schema using Prisma:

   ```bash
   npx prisma migrate dev --name init
   ```

## Running the Project

To start the development server, run the following command:

```bash
npm run dev
```

This will start the server using `nodemon` and `ts-node`, allowing for automatic restarts on file changes.

The server will run on `http://localhost:4000` by default.

## API Endpoints

The system exposes the following GraphQL endpoints:

1. **User Registration**: `registerUser`
2. **User Login**: `loginUser`
3. **Account Verification**: `verifyAccount`
4. **Password Reset Request**: `requestPasswordReset`
5. **Password Reset**: `resetPassword`

## Inputs and Expected Outputs

### 1. User Registration

**Mutation**: `registerUser`

- **Input**:
  ```graphql
  mutation {
    registerUser(username: "john_doe", email: "john@example.com", password: "securepassword") {
      id
      username
      email
    }
  }
  ```

- **Expected Output**:
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

### 2. User Login

**Mutation**: `loginUser`

- **Input**:
  ```graphql
  mutation {
    loginUser(email: "john@example.com", password: "securepassword") {
      token
      user {
        id
        username
        email
      }
    }
  }
  ```

- **Expected Output**:
  ```json
  {
    "data": {
      "loginUser": {
        "token": "eyJhbGciOiJIUzI1NiIsInR...",
        "user": {
          "id": "1",
          "username": "john_doe",
          "email": "john@example.com"
        }
      }
    }
  }
  ```

### 3. Account Verification

**Mutation**: `verifyAccount`

- **Input**:
  ```graphql
  mutation {
    verifyAccount(token: "verification_token_here") {
      message
    }
  }
  ```

- **Expected Output**:
  ```json
  {
    "data": {
      "verifyAccount": {
        "message": "Account verified successfully!"
      }
    }
  }
  ```

### 4. Password Reset Request

**Mutation**: `requestPasswordReset`

- **Input**:
  ```graphql
  mutation {
    requestPasswordReset(email: "john@example.com") {
      message
    }
  }
  ```

- **Expected Output**:
  ```json
  {
    "data": {
      "requestPasswordReset": {
        "message": "Password reset link sent to your email."
      }
    }
  }
  ```

### 5. Password Reset

**Mutation**: `resetPassword`

- **Input**:
  ```graphql
  mutation {
    resetPassword(token: "password_reset_token_here", newPassword: "new_securepassword") {
      message
    }
  }
  ```

- **Expected Output**:
  ```json
  {
    "data": {
      "resetPassword": {
        "message": "Password reset successfully!"
      }
    }
  }
  ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
