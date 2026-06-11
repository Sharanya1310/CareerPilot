import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Mock Dashboard data API endpoint
app.get('/api/dashboard', (req, res) => {
  res.json({
    stats: {
      totalApplications: { count: 42, growth: '+12%', timeline: 'this month' },
      activeStatus: { applied: 42, oa: 26, interview: 15, offer: 5 },
      offersReceived: { count: 2, target: 5, percentage: 40, status: '1 negotiation in progress' }
    },
    atsScore: {
      score: 84,
      trend: '+8 points since last update'
    },
    missingSkills: ['Docker', 'AWS (Lambda/S3)', 'Redix'],
    recommendedJobs: [
      { id: 101, title: 'Full Stack Engineer', company: 'Stripe', location: 'Remote', salary: '$180k - $240k', match: 91, tags: ['React', 'Node.js', 'Go'] },
      { id: 102, title: 'Backend Developer (Python)', company: 'Airbnb', location: 'San Francisco', salary: 'Hybrid', match: 85, tags: ['Python', 'Django', 'PostgreSQL'] }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
