# Workfy Backend API

The backend REST API for Workfy - a robust NestJS-based server providing job search and CV management services for developers.

## 🛠️ Technology Stack

- **NestJS** - Progressive Node.js framework with TypeScript
- **MongoDB** with **Mongoose** - NoSQL database with ODM
- **JWT Authentication** - Secure token-based authentication
- **Passport.js** - Authentication middleware
- **Swagger/OpenAPI** - API documentation
- **Multer** - File upload handling
- **Nodemailer** - Email service integration
- **bcrypt** - Password hashing
- **Helmet** - Security middleware
- **Rate Limiting** - API protection against abuse
- **Mongoose Delete** - Soft delete functionality

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Navigate to server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file similar to `.env.example` in server directory

4. **Start the development server:**

   ```bash
   npm run start:dev
   ```

   Or start your Docker and run `docker compose -p workfy up -d`

5. **Access the API:**
   - API Base URL: `http://localhost:8000`
   - Swagger Documentation: `http://localhost:8000/api`

   Port `8080` when run Docker.
