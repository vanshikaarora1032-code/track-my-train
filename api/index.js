import express from 'express';
import cors from 'cors';
import railwayRoutes from './railway.js';

const app = express();

app.use(cors());
app.use(express.json());

// Main API Route
app.use('/api/railway', railwayRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

export default app;
