# 🎌 Bindass - Premium Anime Fashion Platform

A complete, modern ecommerce application built with Next.js 14, featuring premium anime-inspired fashion and streetwear. This application includes a full-featured admin dashboard, secure Razorpay payment processing, comprehensive product management with variants (size/color), and mobile-responsive design following industry best practices.

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
✅ **Premium Hero section** with fashion-focused design
✅ **Mobile-responsive design** following industry best practices
✅ **Redux Toolkit + RTK Query** for state management
✅ **MongoDB integration** with enhanced product models
✅ **Razorpay payment** integration with complete checkout flow
✅ **Product variants** (size, color) with inventory management
✅ **Admin dashboard** with comprehensive product management
✅ **Dynamic policy pages** (Privacy, Terms, Refund, Shipping)
✅ **Email templates** and notification system
✅ **Shopping cart** with variant selection and Redux persistence
✅ **Wishlist** functionality with persistent storage
✅ **User authentication** with JWT and role-based access
✅ **User dashboard** with order history and account management
✅ **Contact form** with email notifications
✅ **About us** page with company information
✅ **All footer links** working with proper navigation
✅ **Enhanced navbar** with mobile menu and user states
✅ **Security best practices** and input validation
✅ **SEO optimization** and meta tags

## 🔐 Access Information

### Admin Access
- **URL**: `/admin`
- **Default Email**: admin@bindass.com
- **Default Password**: admin123
- **Features**: Product management, order tracking, analytics

### User Access
- **Login**: `/auth/login`
- **Register**: `/auth/register`
- **Dashboard**: `/dashboard`
- **Features**: Order history, wishlist, account settings

## 📱 Complete Page Structure

### Main Pages
- **Home** (`/`) - Enhanced hero section with fashion focus
- **Shop** (`/shop`) - Product catalog with filtering and search
- **About** (`/about`) - Company story, values, and team
- **Contact** (`/contact`) - Contact form with FAQ section
- **Wishlist** (`/wishlist`) - User's saved products

### User Pages
- **Login** (`/auth/login`) - User authentication
- **Register** (`/auth/register`) - User registration
- **Dashboard** (`/dashboard`) - User profile and order history

### Admin Pages
- **Admin Dashboard** (`/admin`) - Complete admin interface
- **Product Management** - CRUD operations for products
- **Order Management** - Order tracking and updates
- **Policy Management** - Dynamic content editing

### Dynamic Pages
- **Policies** (`/policies/[type]`) - Privacy, Terms, Refund, Shipping
- **Product Details** (`/products/[id]`) - Individual product pages

### Additional Pages
- **Careers** (`/careers`) - Job opportunities (coming soon)
- **Press** (`/press`) - Media resources (coming soon)

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/IAmShivay/Anime-Ecommerce)