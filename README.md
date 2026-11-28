# 🎓 CENTER MASR – Full-Stack Educational Platform

A modern full-stack educational platform designed to connect students, teachers, and educational centers through an integrated digital learning ecosystem. Built with Next.js and NestJS, the platform combines secure role-based access control, real-time communication, and efficient data management to deliver a seamless educational experience.

## 🌐 Live Demo 

- **Frontend:** [Visit Center Masr](https://center-masr-full-stack-graduation-n.vercel.app/)
- **Backend API:** [API Base URL](https://center-masr-full-stack-graduation.vercel.app/)
- **API Documentation:** [Swagger Docs](https://center-masr-full-stack-graduation.vercel.app/)

## ✨ Key Features

- **🔐 Authentication & Authorization:** Secure JWT-based authentication and role-based access control (RBAC) for Admins, Teachers, Students, and Educational Centers.
- **👨‍🎓 Student Management:** Dedicated student accounts and personalized educational experiences.
- **👨‍🏫 Teacher Management:** Teacher profiles and educational service management.
- **🏫 Educational Center Management:** Dedicated center accounts and management capabilities.
- **⚡ Real-Time Communication:** WebSocket-based communication for instant updates and real-time interactions.
- **💬 Real-Time Chat:** Live messaging and instant communication between users.
- **🟢 Online Presence:** Real-time user connection and online status tracking.
- **📊 Admin Dashboard:** Centralized platform administration and user management.
- **📱 Responsive Design:** Modern and responsive interfaces optimized for different screen sizes.

## 🛠️ Technical Stack

- **Frontend:** `Next.js` • `React` • `TypeScript` • `Tailwind CSS`
- **Backend:** `NestJS` • `Node.js` • `TypeScript` • `RESTful APIs` • `Class-Validator`
- **Real-Time Communication:** `WebSockets` • `Real-Time Events`
- **Database & ORM:** `PostgreSQL` • `Prisma ORM`
- **Authentication & Security:** `JWT` • `Role-Based Access Control (RBAC)`
- **Deployment:** `Vercel`

## 🏗️ Architecture & Engineering

- Designed a modular backend architecture using NestJS.
- Developed relational database schemas using Prisma and PostgreSQL.
- Implemented role-based authorization to manage permissions across different user roles.
- Integrated WebSocket communication for real-time messaging, online presence, and instant updates.
- Separated frontend and backend applications to support independent development and deployment.

## 💻 Getting Started

1. **Clone the repo:** `git clone https://github.com/Alaa-Fawaz-Manea-AFM/center_masr_Full_Stack_Graduation`
2. **Install deps:** `npm install`
3. **Setup environment:** Create a `.env` file with `DATABASE_URL`, `CLOUDINARY_URL`, and `JWT_SECRET`.
4. **Run migrations:** `npx prisma migrate dev`
5. **Start dev server:** `npm run start:dev`
