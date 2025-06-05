# AnimeScience - Next.js Ecommerce Application

A complete, modern ecommerce application built with Next.js 14, featuring anime and science-themed merchandise. This application includes a full-featured admin dashboard, secure payment processing with Razorpay, and dynamic content management.

## 🚀 Features

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Redux Toolkit** with RTK Query for state management
- **React Hot Toast** for notifications
- **Responsive design** with mobile-first approach

### Backend
- **Next.js API Routes** for serverless functions
- **MongoDB** with Mongoose ODM
- **JWT Authentication** with secure token handling
- **Razorpay Payment Integration** with webhook verification
- **Email notifications** with Nodemailer

### Admin Features
- **Complete admin dashboard** with analytics
- **Product management** (CRUD operations)
- **Order management** with status tracking
- **Dynamic policy management** (Privacy, Terms, Refund, Shipping)

### Ecommerce Features
- **Product catalog** with filtering and search
- **Shopping cart** with Redux persistence
- **Wishlist** functionality
- **Secure checkout** process
- **Order tracking**
- **User authentication** and profiles

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Database**: MongoDB
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: JWT
- **Payments**: Razorpay
- **Email**: Nodemailer

## 📦 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/anime-ecommerce
   NEXTAUTH_SECRET=your-secret-key
   RAZORPAY_KEY_ID=your-razorpay-key
   RAZORPAY_KEY_SECRET=your-razorpay-secret
   JWT_SECRET=your-jwt-secret
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

## 🚀 Features Implemented

✅ **Complete Next.js conversion** from Vite React
✅ **Enhanced Hero section** with better animations
✅ **Redux Toolkit + RTK Query** for state management
✅ **MongoDB integration** with Mongoose models
✅ **Razorpay payment** integration with security
✅ **Admin dashboard** with full CRUD operations
✅ **Dynamic policy pages** (Privacy, Terms, Refund, Shipping)
✅ **Email templates** and notification system
✅ **Shopping cart** with Redux persistence
✅ **Wishlist** functionality
✅ **User authentication** with JWT
✅ **Responsive design** with mobile-first approach
✅ **Security best practices** implemented

## 🔐 Admin Access

- **URL**: `/admin`
- **Default Email**: admin@animeecommerce.com
- **Default Password**: admin123

## 📱 Pages

- **Home** (`/`) - Enhanced hero section and featured products
- **Shop** (`/shop`) - Product catalog with filtering
- **Admin Dashboard** (`/admin`) - Complete admin interface
- **Dynamic Policies** (`/policies/[type]`) - Privacy, Terms, Refund, Shipping

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/IAmShivay/Anime-Ecommerce)