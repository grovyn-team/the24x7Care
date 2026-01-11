# The24x7Care - Monorepo

A comprehensive healthcare platform monorepo containing both frontend and backend applications.

## 📁 Project Structure

```
the247care/
├── frontend/          # Next.js frontend application
├── backend/           # NestJS backend API
├── package.json       # Root workspace configuration
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (for backend)

### Installation

Install all dependencies for both frontend and backend:

```bash
npm install
```

This will install dependencies for all workspaces (frontend and backend) using npm workspaces.

### Environment Setup

#### Backend Environment

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env  # If you have an example file
```

See `backend/README.md` for detailed environment variable configuration.

#### Frontend Environment

Create a `.env.local` file in the `frontend/` directory:

```bash
cd frontend
cp .env.example .env.local  # If you have an example file
```

Set your backend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🛠️ Development

### Run Both Frontend and Backend

From the root directory:

```bash
npm run dev
```

This will start both the frontend (Next.js) and backend (NestJS) in development mode.

### Run Individual Services

**Frontend only:**
```bash
npm run dev:frontend
# or
cd frontend && npm run dev
```

**Backend only:**
```bash
npm run dev:backend
# or
cd backend && npm run start:dev
```

## 🏗️ Build

### Build All

```bash
npm run build
```

### Build Individual Services

```bash
npm run build:frontend
npm run build:backend
```

## 📝 Scripts

Available root-level scripts:

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build all workspaces
- `npm run build:frontend` - Build frontend only
- `npm run build:backend` - Build backend only
- `npm run lint` - Lint all workspaces
- `npm run lint:frontend` - Lint frontend only
- `npm run lint:backend` - Lint backend only

## 📚 Documentation

- **Frontend**: See [frontend/README.md](./frontend/README.md)
- **Backend**: See [backend/README.md](./backend/README.md)

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: React Three Fiber, Three.js
- **Animations**: Framer Motion

### Backend
- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Passport (Google OAuth)
- **API Documentation**: Swagger/OpenAPI

## 📦 Workspace Management

This monorepo uses npm workspaces. To add dependencies:

**To a specific workspace:**
```bash
npm install <package> --workspace=frontend
npm install <package> --workspace=backend
```

**To root (shared dependencies):**
```bash
npm install <package> -w
```

## 🔧 Development Workflow

1. Clone the repository
2. Run `npm install` from the root
3. Set up environment variables for both frontend and backend
4. Start MongoDB (if running locally)
5. Run `npm run dev` to start both services
6. Frontend will be available at `http://localhost:3000`
7. Backend API will be available at `http://localhost:3001`
8. API Documentation (Swagger) at `http://localhost:3001/api/docs`

## 📄 License

Private - The24x7Care
