# 🪪 IDfi — Electronic Student ID Card & Verification System

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_Cloud-47A248?logo=mongodb)](https://www.mongodb.com/atlas)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)

**IDfi** is an institutional-grade, full-stack web application designed for universities and higher education institutions to digitize student identity management. It automates student onboarding, digital ID card issuance, passport photograph validation, live dual-sided card rendering, CR80 single-sheet print previews, and real-time QR code verification.

---

## 🌟 Core System Modules

### 🎓 1. Student Portal
* **Role-Based Authentication**: Secure JWT session management with Bcrypt password hashing.
* **Student Profile & Bio-Data Editor**: Comprehensive information collection (Matriculation No., Study Level, Program, DOB, State of Origin, Next-of-Kin, Signature).
* **Passport Photo Normalization**: Vector-aligned image placement that guarantees pixel-perfect portrait fitting regardless of photo dimensions.
* **Interactive Digital ID Card**: Dynamic dual-sided card with realistic 3D perspective flip, institutional branding, Code128 Barcode, and encrypted QR code.
* **Single-Sheet Print Preview**: Side-by-side Front & Back card layout with official CR80 cut-marks ready for double-sided PVC or paper card printing.
* **Help & Support Ticketing**: Dedicated inquiry and issue-logging interface with status tracking (`Open`, `In Review`, `Resolved`).

### 🛡️ 2. Administrator & Verification Console
* **Overview & Analytics**: Live count counters for total students, pending applications, active accounts, and issued ID cards.
* **Application Review Pipeline**: Dedicated inspector to compare student uploads against institutional records with instant **Approve** or **Reject** workflows.
* **Support Ticket Management**: Search, filter, and resolve student complaints and profile update inquiries.
* **Academic & Course Allocation**: Faculty directory, course creation, and lecturer assignment tools.
* **Public QR Verification Portal (`/verify`)**: Browser camera QR scanner and matriculation search tool for security officers and exam invigilators.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | Next.js 15 (Pages Router), React 18, Tailwind CSS, Lucide Icons, Radix UI |
| **State Management** | Redux Toolkit & React-Redux |
| **Backend / API** | Next.js Serverless API Handlers (`/api/*`), Node.js |
| **Database** | MongoDB Atlas Cloud Database (`mongodb` driver v6 & `mongoose`) |
| **Security** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, HttpOnly cookies |
| **ID Generation** | `qrcode.js`, `react-barcode-generator`, CSS Vector Coordinate Mapping |

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory (or configure these in your deployment platform's Environment Variables settings):

```env
# Database Configuration (MongoDB Atlas Cloud Connection String)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/eid_card_db?retryWrites=true&w=majority
MONGODB_DB_NAME=eid_card_db

# Security & Authentication (Generate a strong 64-character secret)
JWT_SECRET=your_super_secret_jwt_key_here

# API Configuration
NEXT_PUBLIC_API_URL=/api
API_BASE_URL=http://localhost:3000/api
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
* **Node.js**: `v18.17.0` or higher (`v20+` recommended)
* **npm**: `v9+` or **yarn** / **pnpm**
* **MongoDB**: A free [MongoDB Atlas Cluster](https://www.mongodb.com/cloud/atlas) or local MongoDB instance.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/IDfi.git
cd IDfi

# Install project dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Production Deployment Guide

### Option A: Deploying to Vercel (Recommended)

Vercel is the native platform for Next.js applications:

1. **Push your code to GitHub / GitLab / Bitbucket**.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Import your **IDfi** repository.
4. In the **Environment Variables** section, add the following:
   * `MONGODB_URI`: Your MongoDB Atlas connection URI (`mongodb+srv://...`).
   * `MONGODB_DB_NAME`: `eid_card_db`
   * `JWT_SECRET`: A secure random cryptographic key string.
   * `NEXT_PUBLIC_API_URL`: `/api`
   * `API_BASE_URL`: Your production domain URL (e.g. `https://idfi.vercel.app/api`).
5. **MongoDB Network Access**:
   * In [MongoDB Atlas](https://cloud.mongodb.com/), navigate to **Network Access**.
   * Add IP Address: `0.0.0.0/0` (Allow access from anywhere) so Vercel's serverless edge instances can connect.
6. Click **Deploy**. Vercel will build and serve your application with global CDN caching.

---

### Option B: Deploying on a Self-Hosted VPS / Linux Server (Ubuntu / Debian)

1. **Install Node.js & PM2**:
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm
   sudo npm install -g pm2
   ```

2. **Clone & Build**:
   ```bash
   git clone https://github.com/your-username/IDfi.git /var/www/idfi
   cd /var/www/idfi
   npm install
   npm run build
   ```

3. **Start with PM2 Process Manager**:
   ```bash
   pm2 start npm --name "idfi-app" -- start -- -p 3000
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx Reverse Proxy (Example `/etc/nginx/sites-available/idfi`)**:
   ```nginx
   server {
       listen 80;
       server_name idfi.youruniversity.edu;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   ```bash
   sudo ln -s /etc/nginx/sites-available/idfi /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

---

## 📂 Project Structure

```text
IDfi/
├── public/                     # Static assets, SVG card templates, university crests
│   ├── card-front-bg.svg       # CR80 vector template for Front face
│   └── card-back-bg.svg        # CR80 vector template for Back face
├── src/
│   ├── Actions/                # Redux dispatch actions & API client functions
│   ├── components/             # Reusable UI components
│   │   ├── AppSidebar.tsx      # Role-based dynamic navigation sidebar
│   │   ├── DashboardLayout.tsx # Standalone dashboard shell & route guard
│   │   ├── StudentIdCard.tsx   # Interactive & printable dual-face ID Card
│   │   └── ui/                 # Radix UI primitives & design tokens
│   ├── lib/
│   │   ├── mongodb.ts          # MongoDB Atlas connection manager & connection pool
│   │   └── models/             # Schema interfaces (User, Profile, Student, Course)
│   ├── pages/
│   │   ├── api/                # Next.js Serverless API routes
│   │   │   ├── auth/           # Login & Registration endpoints
│   │   │   ├── users/          # Profile retrieval & update handlers
│   │   │   ├── admin/          # Applications approval & user admin APIs
│   │   │   └── complaints.ts   # Student support ticketing endpoint
│   │   ├── auth/index.tsx      # Dual Authentication portal
│   │   ├── dashboard/          # Student portal pages (Home, ID Card, Profile, Help)
│   │   ├── admin/              # Administrator console (Applications, Users, Complaints)
│   │   ├── verify.tsx          # Public QR scanner verification portal
│   │   └── index.tsx           # Institutional landing page
│   ├── state/                  # Redux slices (authSlice, store.ts)
│   └── styles/                 # Global styles & Tailwind CSS directives
├── .env.example                # Sample environment variables configuration
├── package.json                # Project scripts & dependencies
└── tsconfig.json               # TypeScript compiler options & module aliasing
```

---

## 🔒 Security Best Practices Implemented

* **Password Protection**: Passwords are never stored in plaintext and are salted and hashed using `bcryptjs`.
* **Stateless Authorization**: Requests to protected routes utilize signed `JSON Web Tokens (JWT)`.
* **Data Sanitization**: MongoDB queries are typed, parameter-scoped, and immutable system keys (`_id`) are stripped before updates.
* **Vector Coordinate Integrity**: Photo placements use SVG vector percentages (`aspect-[373/220]`), ensuring zero distortion across all screen resolutions and physical print media.

---

## 📄 License
This project is licensed under the **MIT License**.
