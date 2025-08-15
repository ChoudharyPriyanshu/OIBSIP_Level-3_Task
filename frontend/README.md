# PizzaHub - Complete React Pizza Ordering Application

A comprehensive pizza ordering application built with React, Redux Toolkit, React Router, and Tailwind CSS, featuring custom pizza builder, Razorpay payment integration, and complete admin panel.

## 🚀 Features

### Authentication System
- ✅ User registration and login
- ✅ Email verification (with token-based verification)
- ✅ Password reset functionality
- ✅ JWT-based authentication with localStorage persistence
- ✅ Role-based access control (Admin/User)

### Custom Pizza Builder
- ✅ 5-step pizza builder process:
  1. Choose base (required)
  2. Select sauce (required)  
  3. Pick cheese (required)
  4. Add veggies (optional, multi-select)
  5. Add meat (optional, multi-select)
- ✅ Live price calculation
- ✅ Dynamic ingredient loading from inventory
- ✅ Visual progress stepper

### Payment Integration
- ✅ Razorpay test mode integration
- ✅ Payment verification and order confirmation
- ✅ Cash on Delivery option
- ✅ Order summary and success page

### User Features
- ✅ Pizza dashboard with filtering and search
- ✅ Order tracking with real-time updates (10-second polling)
- ✅ Order history and status tracking
- ✅ User profile management
- ✅ Responsive design for all devices

### Admin Panel
- ✅ Complete dashboard with statistics
- ✅ User management (list, delete)
- ✅ Inventory management with stock thresholds
- ✅ Pizza CRUD operations
- ✅ Order status management
- ✅ Low stock alerts

### Technical Features
- ✅ Redux Toolkit for state management
- ✅ React Router v6 with protected routes
- ✅ Axios with interceptors for API calls
- ✅ Toast notifications for user feedback
- ✅ Loading states and error handling
- ✅ Mobile-first responsive design

## 🛠 Technology Stack

- **Frontend**: React 18+ with Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Payments**: Razorpay (Test Mode)

## 🏗 Project Structure

```
src/
├── api/                    # API layer with axios configuration
│   ├── axios.js           # Axios instance with interceptors
│   ├── authApi.js         # Authentication API calls
│   ├── userApi.js         # User management API calls
│   ├── pizzaApi.js        # Pizza-related API calls
│   ├── inventoryApi.js    # Inventory management API calls
│   └── orderApi.js        # Order management API calls
├── components/            # Reusable components
│   ├── Navbar.jsx         # Navigation component
│   ├── Footer.jsx         # Footer component
│   ├── Loader.jsx         # Loading components
│   ├── ProtectedRoute.jsx # Route protection for authenticated users
│   └── AdminRoute.jsx     # Route protection for admin users
├── layouts/               # Layout components
│   ├── MainLayout.jsx     # Main application layout
│   ├── AuthLayout.jsx     # Authentication pages layout
│   └── AdminLayout.jsx    # Admin panel layout
├── pages/                 # Page components
│   ├── Public/            # Public pages
│   ├── Auth/              # Authentication pages
│   ├── User/              # Protected user pages
│   └── Admin/             # Admin panel pages
├── store/                 # Redux store configuration
│   ├── store.js           # Store configuration
│   └── slices/            # Redux slices
│       ├── authSlice.js   # Authentication state
│       ├── pizzaSlice.js  # Pizza management state
│       ├── inventorySlice.js # Inventory state
│       ├── orderSlice.js  # Order management state
│       └── usersSlice.js  # User management state
├── App.tsx                # Main application component
└── main.tsx              # Application entry point
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Backend API server running (see backend requirements)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd pizzahub-frontend
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_RAZORPAY_KEY=rzp_test_your_key_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🧪 Testing Each Flow

### 1. Authentication Flow
1. Navigate to `/register` to create a new account
2. Check email verification (backend should send verification email)
3. Visit `/verify-email/:token` to verify account
4. Login at `/login` with credentials
5. Test forgot password flow at `/forgot-password`
6. Admin users are redirected to `/admin`, regular users to `/dashboard`

### 2. Pizza Builder Flow
1. Login and visit `/custom`
2. Step through the 5-step pizza builder:
   - Select base ingredient
   - Choose sauce
   - Pick cheese
   - Add vegetables (optional)
   - Add meat (optional)
3. Watch live price calculation
4. Proceed to checkout

### 3. Payment Flow (Razorpay Test)
1. Complete pizza builder
2. Fill delivery address at `/checkout`
3. Select Razorpay payment
4. Use test card details:
   - Card: 4111 1111 1111 1111
   - Expiry: Any future date
   - CVV: Any 3 digits
5. Complete payment and verify order creation

### 4. Admin Panel Testing
1. Login as admin user
2. Navigate to `/admin` for dashboard overview
3. Test each admin section:
   - **Users**: View and delete users
   - **Inventory**: Add/edit items, monitor stock levels
   - **Pizzas**: CRUD operations on menu items
   - **Orders**: Update order status, view order details

### 5. Order Tracking
1. Place an order as a user
2. Visit `/orders` to see order list
3. Admin updates order status in `/admin/orders`
4. User sees live updates (refreshes every 10 seconds)

## 🔧 API Integration

The frontend expects the following backend endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify/:token` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password/:token` - Password reset

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users` - Admin: Get all users
- `DELETE /api/users/:id` - Admin: Delete user

### Pizza Management
- `GET /api/pizzas` - Get all pizzas
- `GET /api/pizzas/:id` - Get pizza details
- `POST /api/pizzas` - Admin: Create pizza
- `PUT /api/pizzas/:id` - Admin: Update pizza
- `DELETE /api/pizzas/:id` - Admin: Delete pizza

### Inventory Management
- `GET /api/inventory` - Get all inventory
- `GET /api/inventory/category/:category` - Get by category
- `POST /api/inventory` - Admin: Create item
- `PUT /api/inventory/:id` - Admin: Update item

### Order Management
- `POST /api/orders/custom` - Create custom pizza order
- `POST /api/orders/verify` - Verify Razorpay payment
- `GET /api/orders/my` - Get user's orders
- `GET /api/orders` - Admin: Get all orders
- `PATCH /api/orders/:id/status` - Admin: Update status

## 🎨 Design Features

- **Modern Gradient Design**: Blue to purple gradients throughout
- **Responsive Layout**: Mobile-first approach with Tailwind breakpoints
- **Interactive Elements**: Hover states, transitions, and micro-interactions
- **Toast Notifications**: User feedback for all actions
- **Loading States**: Skeleton loading and spinners
- **Card-based UI**: Clean, modern card layouts
- **Professional Color Scheme**: Blue (#3B82F6) primary with semantic colors

## 🚨 Important Notes

### Stock Management
- Backend automatically reduces stock on order placement
- Frontend displays low stock alerts when quantity < threshold
- Admin can update stock quantities and thresholds

### Real-time Updates
- Order status polling every 10 seconds on user orders page
- Live price calculation in pizza builder
- Immediate UI updates for admin actions

### Security
- JWT tokens stored in localStorage
- Protected routes with role-based access
- Input validation and error handling
- CORS configuration for API calls

### Payment Integration
- Razorpay integration in **TEST MODE only**
- Payment verification through backend
- COD fallback option available
- Order confirmation after successful payment

## 📱 Responsive Design

The application is fully responsive with optimized layouts for:
- **Mobile** (<768px): Single column layouts, mobile-first navigation
- **Tablet** (768-1024px): Two-column grids, expanded cards
- **Desktop** (>1024px): Multi-column layouts, full feature visibility

## 🔮 Future Enhancements

- Real-time WebSocket updates for order status
- Push notifications for order updates
- Pizza favorites and recommendations
- Advanced inventory analytics
- Social login integration
- Multi-language support

## 📄 License

This project is created for educational purposes. All rights reserved.