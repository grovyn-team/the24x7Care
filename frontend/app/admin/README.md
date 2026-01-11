# Admin Panel

Protected admin panel for The24x7Care with authentication and dashboard management.

## Features

- **Authentication**: JWT-based login system
- **Protected Routes**: Automatic redirect to login if not authenticated
- **Dashboard**: Statistics overview with key metrics
- **User Management**: View and manage doctors
- **Query Management**: View and manage patient enquiries
- **Service Management**: CRUD operations for services

## Pages

### `/admin/login`
- Login page with email and password
- Form validation
- Error handling

### `/admin/dashboard`
- Statistics cards (Total Users, Pending Queries, Active Services, Total Doctors)
- Recent bookings section
- Real-time data from backend API

### `/admin/users`
- List of all doctors
- Table view with pagination
- Edit and delete actions (to be implemented)

### `/admin/queries`
- List of all patient enquiries
- Status indicators (new, viewed, completed)
- Assignee information
- Edit and delete actions (to be implemented)

### `/admin/services`
- Grid view of all services
- Service details (title, description, perks)
- Add, Edit, Delete actions (to be implemented)

## Authentication

The admin panel uses JWT authentication:
- Login credentials are stored in localStorage
- Protected routes automatically redirect to login
- Token is sent with all API requests

## API Integration

All API calls are made through `/app/lib/api.ts`:
- Base URL: `http://localhost:3001/api` (configurable via `NEXT_PUBLIC_API_URL`)
- JWT token automatically included in headers
- Error handling for failed requests

## Environment Variables

**Required**: Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

The app will use this URL for all API requests. If not set, it will fallback to `http://localhost:3001/api` and show a console warning.

For production, update to your production API URL:
```env
NEXT_PUBLIC_API_URL=https://api.the247care.com/api
```

## Default Admin Credentials

- Email: `admin@the247care.com` (or as configured in backend)
- Password: `admin123` (or as configured in backend)

**Important**: Change default credentials after first login!
