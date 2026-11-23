
# EasyRent – Equipment Rental Platform

**EasyRent** is a full-stack equipment rental platform where customers can browse and rent equipment, owners can list and manage their equipment, and administrators can manage the entire platform.

The platform provides a seamless rental experience with secure authentication, role-based access control, equipment management, booking functionality, and online payment processing.

## 🌐 Live Website

🔗 https://easy-rent-client.vercel.app/

## ✨ Key Features

### 👤 Authentication & Authorization
- Secure user authentication using Better Auth.
- Role-based access control for Customers, Owners, and Admins.
- Protected routes and role-specific dashboards.

### 🛒 Customer Features
- Browse and explore available rental equipment.
- View detailed equipment information.
- Book equipment with a secure checkout process.
- View rental history and booking details.
- Add equipment to favorites.
- Manage personal profile information.

### 🏪 Owner Features
- Add new equipment listings.
- Update and delete existing equipment.
- Manage listed equipment and availability.
- View and manage rental bookings.

### 🛡️ Admin Features
- Manage registered users.
- Monitor and manage equipment listings.
- Manage rental bookings across the platform.
- Maintain overall platform activities.

### 💳 Payment Integration
- Secure online payment processing with Stripe.
- Integrated checkout functionality for equipment rentals.

### 🖼️ Image Management
- Image uploading and hosting using ImgBB.
- Store and display equipment images through hosted image URLs.

---

## 🛠️ Technology Stack

🎨 Frontend - Next.js | React | TypeScript | Tailwind CSS | Shadcn/ui | Framer Motion
  
⚙️ Backend - Node.js | Express 5 | CORS | dotenv | MongoDB | JWT Authentication (jose)

🔐 Authentication - Better Auth

💳 Payment Gateway - Stripe

🖼️ Image Hosting - ImgBB

🚀 Deployment - Vercel

---

## 📦 NPM Packages

### Frontend Dependencies
- `@base-ui/react`
- `@better-auth/mongo-adapter`
- `better-auth`
- `class-variance-authority`
- `framer-motion`
- `lucide-react`
- `mongodb`
- `next`
- `react`
- `react-dom`
- `react-hot-toast`
- `react-icons`
- `shadcn`
- `@tailwindcss/turbopack`

### Backend Dependencies
- `cors`
- `dotenv`
- `express`
- `jose`
- `mongodb`
- `stripe`
- `imgbb`

### Development Dependencies
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `babel-plugin-react-compiler`
- `eslint`
- `eslint-config-next`
- `nodemon`
- `tailwindcss`
- `typescript`

---

## 🔐 Security

- Better Auth for user authentication.
- JWT verification using `jose`.
- Role-based authorization for protected resources.
- Secure payment processing through Stripe.
- Environment variables for sensitive configuration.

---

⭐ If you find this project interesting, feel free to explore the repository and share your feedback!
