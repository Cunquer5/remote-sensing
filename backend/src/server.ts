import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dashboardRoutes from './routes/dashboard';
import fieldsRoutes from './routes/fields';
import indicesRoutes from './routes/indices';
import advisoryRoutes from './routes/advisory';
import dataSourcRoutes from './routes/dataSources';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/fields', fieldsRoutes);
app.use('/api/indices', indicesRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/data-sources', dataSourcRoutes);

// Root endpoint
app.get('/api', (req: Request, res: Response) => {
  res.json({
    name: 'CaneSense AI Backend API',
    version: '1.0.0',
    description: 'Remote sensing and AI-powered sugarcane crop intelligence platform',
    studyArea: 'Baitul, Madhya Pradesh, India',
    environment: process.env.NODE_ENV || 'development',
    mode: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'DEMO DATA',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🌾 CaneSense AI Backend Server`);
  console.log(`📍 Study Area: Baitul, Madhya Pradesh, India`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🏷️  Mode: ${process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'DEMO DATA'}`);
  console.log(`\nAPI Documentation:`);
  console.log(`  - GET  /api               - API info`);
  console.log(`  - GET  /api/dashboard     - Dashboard summary`);
  console.log(`  - GET  /api/fields        - Fields list`);
  console.log(`  - GET  /api/fields/:id    - Field details`);
  console.log(`  - GET  /api/indices       - Vegetation indices`);
  console.log(`  - GET  /api/advisory      - Irrigation advisories`);
  console.log(`  - GET  /api/data-sources  - Data source specifications`);
  console.log(`\n`);
});
