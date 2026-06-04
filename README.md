# E-ID CARD System

A modern, full-stack web application designed for universities and institutions to seamlessly manage student registrations, profiles, and digital ID card applications. Built with **Next.js**, **React**, **Tailwind CSS**, and **MongoDB**.

## 🌟 Features

### 🎓 For Students
* **Authentication:** Secure Signup, Login, and session management.
* **Profile Setup:** Comprehensive user profile forms to collect Bio-data (Name, Program, Student ID, DOB, State of Origin, etc).
* **ID Card Application:** One-click digital ID card application workflow with real-time status tracking (Unapplied -> Pending -> Verified/Rejected).
* **Digital ID Card:** Beautifully designed, printable digital ID Card that acts as official student identification.
* **Dashboard & Notifications:** Track profile completeness, active notifications, and system status right from the dashboard.

### 🛡️ For Administrators
* **Overview Dashboard:** View analytics like total registered students, pending applications, and verified users.
* **Manage Users:** Filter, search, and sort through all registered accounts in the system.
* **Application Processing:** A dedicated Validation Drawer to instantly **Approve** or **Reject** pending student applications with just one click.
* **Database Synchronization:** Automatic merging of Auth Accounts (`users`) with student information (`profiles`) for a unified data view.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (Pages Router), React, Tailwind CSS, Lucide Icons
* **Backend:** Next.js API Routes (Serverless Node.js environment)
* **Database:** MongoDB & Mongoose
* **State Management:** Redux Toolkit
* **Authentication:** JSON Web Tokens (JWT) & bcrypt

---

## 🚀 Getting Started Locally

### 1. Clone the repository
Ensure you have the code locally on your machine.

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root of your project and configure the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/eid_card_db
MONGODB_DB_NAME=eid_card_db

# Security (Change this in production)
JWT_SECRET=your_super_secret_key_here

# API Base URL (Required for Server-Side calls)
API_BASE_URL=http://localhost:3000/api
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🌍 Deploying to Production (Vercel)

This application is optimized for deployment on **Vercel**. When migrating your app to production, make sure you configure your Vercel Environment Variables properly:

1. **`MONGODB_URI`**: Must be a remote MongoDB Atlas connection string (e.g. `mongodb+srv://...`). You cannot use `localhost` in production.
2. **`MONGODB_DB_NAME`**: Set to the name of your target database in Atlas (e.g., `eid_card_db`).
3. **`JWT_SECRET`**: Generate a strong, secure, random string for cryptographic security.
4. *Note: You do NOT need to define `PORT` or `API_BASE_URL` on Vercel as Next.js handles internal routing naturally in production.*

To deploy, simply link your GitHub repository to Vercel and it will automatically build and deploy your app.
