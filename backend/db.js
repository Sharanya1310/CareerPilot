import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

class JSONDatabase {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(dbPath)) {
        const raw = fs.readFileSync(dbPath, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        console.error('db.json not found, initializing with empty state');
        this.data = {
          stats: {
            totalApplications: { count: 0, growth: '+0%', timeline: 'this month' },
            activeStatus: { applied: 0, oa: 0, interview: 0, offer: 0 },
            offersReceived: { count: "00", target: 5, percentage: 0, status: '0 negotiations in progress' }
          },
          atsScore: { score: 84, trend: '+8 points' },
          missingSkills: [],
          recommendedJobs: [],
          recentApplications: [],
          trackedCompanies: [],
          upcomingInterviews: [],
          applications: [],
          profile: {
            name: 'Sharanya Singh',
            email: 'sharanya@email.com',
            frontendSkills: [],
            backendSkills: [],
            toolsSkills: [],
            desiredRoles: [],
            preferredLocations: [],
            workTypes: { remote: true, hybrid: true, onsite: false }
          },
          resumes: []
        };
        this.save();
      }
    } catch (err) {
      console.error('Failed to initialize JSON database:', err);
    }
  }

  save() {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to write to db.json:', err);
    }
  }

  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    this.save();
  }

  // Auto-recalculate stats based on applications array
  syncStats() {
    const apps = this.data.applications || [];
    
    // Count stages
    const applied = apps.filter(a => a.stage === 'Applied').length;
    // Support either "Assessment" or "OA" naming
    const oa = apps.filter(a => a.stage === 'Assessment' || a.stage === 'OA').length;
    const interview = apps.filter(a => a.stage === 'Interview').length;
    const offer = apps.filter(a => a.stage === 'Offer').length;

    this.data.stats.totalApplications.count = apps.length;
    this.data.stats.activeStatus = { applied, oa, interview, offer };
    
    // Formatting offer counter
    const offersCountStr = offer < 10 ? `0${offer}` : `${offer}`;
    const offerPercentage = Math.round((offer / this.data.stats.offersReceived.target) * 100);

    this.data.stats.offersReceived.count = offersCountStr;
    this.data.stats.offersReceived.percentage = Math.min(offerPercentage, 100);
    this.data.stats.offersReceived.status = `${offer} offer(s) received`;

    // Also keep recentApplications synced with the last 2 applications
    const recent = [...apps]
      .sort((a, b) => {
        // Simple sort: assume higher ID is newer
        return b.id - a.id;
      })
      .slice(0, 2)
      .map(a => {
        let color = 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20';
        if (a.stage === 'Interview') {
          color = 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
        } else if (a.stage === 'Assessment' || a.stage === 'OA') {
          color = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        } else if (a.stage === 'Offer') {
          color = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        }
        return {
          id: a.id,
          company: a.company,
          role: a.role,
          status: a.stage,
          color,
          date: a.date
        };
      });

    this.data.recentApplications = recent;
    this.save();
  }

  syncActiveResume() {
    const resumes = this.data.resumes || [];
    const active = resumes.find(r => r.isActive);
    if (active) {
      if (!this.data.profile) this.data.profile = {};
      this.data.profile.resumeFilename = active.name;
      this.data.profile.resumeScore = active.score;
      
      const formattedDate = new Date(active.uploadedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      this.data.profile.resumeUpdated = `Active • ${formattedDate}`;
      
      if (!this.data.atsScore) this.data.atsScore = {};
      this.data.atsScore.score = active.score;

      if (!this.data.resumeOptimizationData) this.data.resumeOptimizationData = {};
      this.data.resumeOptimizationData.compatibilityScore = active.score;
      this.data.resumeOptimizationData.myResumes = resumes.map(r => ({
        name: r.name,
        status: r.isActive ? `Active • ${new Date(r.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : new Date(r.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        score: r.score
      }));
    }
    this.save();
  }
}

export const db = new JSONDatabase();

