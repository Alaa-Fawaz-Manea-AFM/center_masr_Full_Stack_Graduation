# 🎓 CENTER MASR – Full-Stack Educational Platform

A modern and comprehensive Full-Stack Educational Platform designed to connect students, teachers, and educational centers through an integrated digital learning ecosystem. Built with Next.js and NestJS, the platform provides secure authentication, role-based access control, real-time communication, and efficient educational management.

## 🌐 Live Demo & Project Links

- **Frontend Application:** [Visit Center Masr](https://center-masr-full-stack-graduation-n.vercel.app/)
- **Backend API:** [Backend Server](https://center-masr-full-stack-graduation.vercel.app/)
- **API Documentation:** [Swagger Documentation](YOUR_SWAGGER_URL)

## ✨ Key Features

- **🔐 Authentication & Authorization:** Secure JWT-based authentication and Role-Based Access Control (RBAC) for Admins, Teachers, Students, and Educational Centers.
- **👨‍🎓 Student Management:** Dedicated student accounts and personalized educational experiences.
- **👨‍🏫 Teacher Management:** Teacher profiles and educational service management.
- **🏫 Educational Center Management:** Dedicated center accounts and management capabilities.
- **⚡ Real-Time Communication:** WebSocket-based communication for instant updates and real-time interactions.
- **💬 Real-Time Chat:** Live messaging and instant communication between users.
- **🟢 Online Presence:** Real-time user connection and online status tracking.
- **📊 Admin Dashboard:** Centralized platform administration and user management.
- **📱 Responsive Design:** Modern and responsive interfaces optimized for different screen sizes.

## 🛠️ Technical Stack

### Frontend
- Next.js
- React.js
- TypeScript
- Tailwind CSS
- Context API
- Axios

### Backend
- NestJS
- Node.js
- TypeScript
- RESTful APIs
- Class Validator
- JWT Authentication

### Real-Time Communication
- WebSockets
- Real-Time Events
- Online Presence
- Real-Time Messaging

### Database & ORM
- PostgreSQL
- Prisma ORM

### Cloud & Media Storage
- Cloudinary

### Deployment & Tools
- Vercel
- Git & GitHub
- Postman

## 🏗️ Architecture & Engineering

- Developed a modular backend architecture using NestJS.
- Built a responsive frontend application using Next.js and TypeScript.
- Designed relational database schemas using Prisma and PostgreSQL.
- Implemented secure JWT authentication and role-based authorization.
- Integrated WebSocket communication for real-time messaging, online presence, and instant updates.
- Separated frontend and backend applications for independent development and deployment.
- Integrated Cloudinary for cloud-based media management.

## 📁 Project Structure

```text
CENTER-MASR/
│
├── front_end/
│   ├── src/
│   │   └── app/
│   ├── public/
│   ├── package.json
│   └── .env.local
│
├── back_end/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── .env
│
└── README.md
```

## ⚙️ Environment Configuration

The project consists of two independent applications, each requiring its own environment configuration.

### 1. Frontend Environment

Create a `.env.local` file inside the `front_end` directory.

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

NEXT_PUBLIC_WS_URL=
NEXT_PUBLIC_BACK_URL=

NODE_ENV=development
```

**Environment Variables:**
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name.
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: Cloudinary upload preset.
- `NEXT_PUBLIC_WS_URL`: Backend WebSocket server URL.
- `NEXT_PUBLIC_BACK_URL`: Backend API base URL.

### 2. Backend Environment

Create a `.env` file inside the `back_end` directory.

```env
PORT=3001
NODE_ENV=development

FRONT_END_URL=

DATABASE_URL=

JWT_SECRET_KEY=
JWT_EXPIRES_IN=1d

COOKIE_MAX_AGE1=86400000
COOKIE_DOMAIN=

JWT_REFRESH_SECRET_KEY=
JWT_REFRESH_EXPIRES_IN=7d

JWT_ISSUER=
```

**Environment Variables:**
- `PORT`: Backend server port.
- `FRONT_END_URL`: Frontend application URL for CORS configuration.
- `DATABASE_URL`: PostgreSQL database connection string.
- `JWT_SECRET_KEY`: Secret key for access token signing.
- `JWT_EXPIRES_IN`: Access token expiration duration.
- `COOKIE_MAX_AGE1`: Cookie lifetime in milliseconds.
- `COOKIE_DOMAIN`: Cookie domain configuration.
- `JWT_REFRESH_SECRET_KEY`: Secret key for refresh token signing.
- `JWT_REFRESH_EXPIRES_IN`: Refresh token expiration duration.
- `JWT_ISSUER`: JWT issuer identifier.

## 💻 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Alaa-Fawaz-Manea-AFM/center_masr_Full_Stack_Graduation.git
```

### 2. Backend Setup

```bash
cd back_end
npm install
```

Configure the backend `.env` file, then run Prisma migrations:

```bash
npx prisma migrate dev
```

Start the backend development server:

```bash
npm run start:dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd front_end
npm install
```

Configure the frontend `.env.local` file, then start the development server:

```bash
npm run dev
```

### 4. Access the Application

Open the frontend application in your browser:

```text
http://localhost:3000
```

The backend runs on the configured port:

```text
http://localhost:3001
```

## 🔒 Security

- Sensitive environment variables are stored separately in backend and frontend configuration files.
- JWT secrets and database credentials must never be exposed to the client.
- Environment files must not be committed to public repositories.
- Public environment variables should only contain non-sensitive configuration.

---

**Developed as a Full-Stack Educational Platform using Next.js, NestJS, PostgreSQL, Prisma, and WebSockets.**
