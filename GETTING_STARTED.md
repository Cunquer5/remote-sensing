## Installation

### Prerequisites
- Node.js 16+
- npm or yarn
- PostgreSQL 12+ (for production)
- Python 3.8+ (for ML/GEE services)

### Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Install Backend Dependencies  
```bash
cd backend
npm install
```

### Setup Environment Files

**Frontend** (`frontend/.env.local`)
```
VITE_API_BASE_URL=http://localhost:5000
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_APP_MODE=demo
```

**Backend** (`backend/.env`)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/canesense
GEE_PROJECT_ID=your-gee-project
MAPBOX_TOKEN=your-token
IS_DEMO_MODE=true
```

## Running the Application

### Development Mode (Both Frontend & Backend)
```bash
npm run dev
```

**Frontend** will be available at: http://localhost:3000  
**Backend API** will be available at: http://localhost:5000

### Frontend Only
```bash
cd frontend
npm run dev
```

### Backend Only
```bash
cd backend
npm run dev
```

## Building for Production

### Build Both
```bash
npm run build
```

### Build Frontend Only
```bash
cd frontend
npm run build
```

### Build Backend Only
```bash
cd backend
npm run build
npm run start
```
