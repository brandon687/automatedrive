import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import submissionRoutes from './routes/submission.routes';
import vinRoutes from './routes/vin.routes';
import adminRoutes from './routes/admin.routes';
import dealerRoutes from './routes/dealer.routes';
import valuationRoutes from './routes/valuation.routes';
import licensePlateRoutes from './routes/licensePlate.routes';
import marketResearchRoutes from './routes/marketResearch.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration with multiple allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://dealertrade-app.vercel.app',
  'https://chic-hope-production.up.railway.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Static admin dashboard
app.use('/admin', express.static('public'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    name: 'DealerTrade API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      admin: '/admin',
      api: {
        submissions: '/api/submissions',
        vin: '/api/vin',
        admin: '/api/admin',
        dealer: '/api/dealer',
        valuation: '/api/valuation',
        licensePlate: '/api/license-plate',
        marketResearch: '/api/market-research'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/submissions', submissionRoutes);
app.use('/api/vin', vinRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dealer', dealerRoutes);
app.use('/api/valuation', valuationRoutes);
app.use('/api/license-plate', licensePlateRoutes);
app.use('/api/market-research', marketResearchRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
