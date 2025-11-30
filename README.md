# Vendorly Frontend

A modern, mobile-first frontend for Vendorly - a WhatsApp-based e-commerce platform that helps vendors sell more efficiently.

## 🚀 Features

- **Vendor Authentication**: Sign up/Login with email verification
- **Personal Storefront**: Public, shareable store URLs
- **Product Management**: Add, edit, and delete products with images
- **Unique Product Links**: Share individual product pages
- **WhatsApp Integration**: Pre-filled WhatsApp messages for easy ordering
- **Vendor Dashboard**: Manage products and view store analytics
- **Customer Explore Page**: Browse trending products from all vendors

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Redux Toolkit
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📁 Project Structure

```
vendorly-frontend/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Vendor dashboard
│   ├── shop/              # Public storefront pages
│   └── explore/           # Customer explore page
├── components/            # React components
│   ├── forms/            # Form components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── dashboard/        # Dashboard-specific components
│   └── storefront/       # Storefront components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configs
├── redux/                # Redux store and slices
└── types/                # TypeScript type definitions
```

## 🏃 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 API Integration

The frontend expects a backend API running on the URL specified in `NEXT_PUBLIC_API_URL`. The backend should implement the following endpoints:

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with optional `?vendorId=xxx`)
- `GET /api/products/:id` - Get single product
- `GET /api/products/trending` - Get trending products
- `POST /api/products` - Create product (multipart/form-data)
- `PUT /api/products/:id` - Update product (multipart/form-data)
- `DELETE /api/products/:id` - Delete product

### Vendors
- `GET /api/vendors/storefront/:storeName` - Get vendor storefront

## 🎨 UI/UX Features

- **Mobile-first design**: Responsive across all devices
- **Toast notifications**: User feedback for actions
- **Loading states**: Smooth loading indicators
- **Error handling**: Graceful error messages
- **Image uploads**: Multiple image support for products
- **Copy-to-clipboard**: Easy link sharing

## 🔐 Authentication Flow

1. **Vendor Signup**: Full name, email, password, store name, phone number
2. **Customer Signup**: Full name, email, password
3. **Login**: Email and password
4. **Auto-redirect**: Based on user role (vendor → dashboard, customer → explore)

## 📱 WhatsApp Integration

When a customer clicks "Order Now on WhatsApp", a pre-filled message is generated:
```
Hello! I'm interested in the [Product Name] ([Price]). Is it still available?
```

The message opens in WhatsApp with the vendor's phone number.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Build for Production

```bash
npm run build
npm start
```

## 📄 License

MIT

## 🤝 Contributing

This is the frontend part of Vendorly. The backend is handled separately.

