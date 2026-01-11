# The24x7Care Backend API

A scalable NestJS backend application for The24x7Care healthcare platform with MongoDB integration.

## Features

- **Authentication**: JWT-based authentication with Google OAuth2.0 support
- **Role-based Access Control**: Admin and Doctor roles with different permissions
- **Enquiry Management**: Public enquiry submission with admin/doctor assignment
- **Patient Management**: Automatic patient creation and tracking
- **Doctor Management**: CRUD operations for doctors
- **Services Management**: Dynamic service management
- **Social Media Links**: Manage social media handles
- **Core Values**: Manage company core values
- **Leadership Team**: Manage leadership team members
- **Payment Integration**: Payment gateway integration (placeholder for Razorpay/Stripe)
- **Admin Dashboard**: Statistics and management dashboard

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Passport (Google OAuth)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration
```

## Environment Variables

```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/the247care
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
ADMIN_EMAIL=admin@the247care.com
ADMIN_PASSWORD=admin123

# CORS Configuration
# Single URL or comma-separated list of allowed frontend URLs
FRONTEND_URL=http://localhost:3000
# OR for multiple origins:
# FRONTEND_URLS=http://localhost:3000,http://192.168.1.43:3000,https://the247care.com
```

**Note on CORS**: 
- In development mode, the backend automatically allows requests from localhost and local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
- For production, explicitly set `FRONTEND_URLS` with all allowed origins
- If accessing from a network IP (like `http://192.168.1.43:3000`), it will be automatically allowed in development mode

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:3001/api/docs

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new user
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### Enquiries (Public)
- `POST /api/enquiries` - Create new enquiry

### Enquiries (Protected)
- `GET /api/enquiries` - Get all enquiries (admin/doctor)
- `GET /api/enquiries/:id` - Get enquiry by ID
- `PATCH /api/enquiries/:id` - Update enquiry
- `DELETE /api/enquiries/:id` - Delete enquiry (admin only)

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/my-enquiries` - Get assigned enquiries (doctor)
- `POST /api/doctors` - Create doctor (admin only)
- `PATCH /api/doctors/:id` - Update doctor (admin only)
- `DELETE /api/doctors/:id` - Delete doctor (admin only)

### Services (Public)
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID

### Services (Admin)
- `POST /api/services` - Create service
- `PATCH /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Social Media (Public)
- `GET /api/social-media` - Get all social media links

### Social Media (Admin)
- `POST /api/social-media` - Create social media link
- `PATCH /api/social-media/:id` - Update social media link
- `DELETE /api/social-media/:id` - Delete social media link

### Core Values (Public)
- `GET /api/core-values` - Get all core values

### Core Values (Admin)
- `POST /api/core-values` - Create core value
- `PATCH /api/core-values/:id` - Update core value
- `DELETE /api/core-values/:id` - Delete core value

### Leadership Team (Public)
- `GET /api/leadership-team` - Get all leadership team members

### Leadership Team (Admin)
- `POST /api/leadership-team` - Add leadership team member
- `PATCH /api/leadership-team/:id` - Update leadership team member
- `DELETE /api/leadership-team/:id` - Remove leadership team member

### Payment
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics

## Database Schema

### Enquiries
- patient_name, patient_age, patient_mob, message
- assignee (Doctor reference)
- status (new | viewed | completed)

### Patients
- patient_name, patient_age, patient_gender, patient_mob
- queries_raised (array of Enquiry references)

### Doctors
- name, specialization, mobile, employee_id
- queries_assigned (array of Enquiry references)
- gender, avatar_url

### Services
- title, description, perks, book_via

### Social Media
- title, icon_url, href

### Core Values
- icon_url, title, description

### Leadership Team
- designation, member_id (Doctor reference)

## Default Admin Credentials

- Email: admin@the247care.com (or as set in .env)
- Password: admin123 (or as set in .env)

**Important**: Change the default admin password after first login!

## Payment Gateway Integration

The payment module currently has placeholder implementations. To integrate:

1. Install your preferred payment gateway SDK (e.g., `razorpay` or `stripe`)
2. Update `src/payment/payment.service.ts` with actual implementation
3. Add payment verification and webhook handling

## License

Private - The24x7Care
