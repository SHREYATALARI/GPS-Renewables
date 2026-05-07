<div align="center">

# GPS Renewables AI Scientific Research Platform

### Futuristic dual-domain AI operating system for **Chemical Catalysis** and **Synthetic Biology**

*Accelerating sustainable fuels, enzyme engineering, and industrial scientific decision-making through intelligent workflow automation.*

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![AI Powered](https://img.shields.io/badge/AI-Powered-7C3AED)
![Synthetic Biology](https://img.shields.io/badge/Domain-Synthetic%20Biology-0EA5E9)
![Chemical Catalysis](https://img.shields.io/badge/Domain-Chemical%20Catalysis-10B981)
![Hackathon Project](https://img.shields.io/badge/Hackathon-Ready-F59E0B)
![Open Source](https://img.shields.io/badge/License-MIT-green)

</div>

---

## Project Overview

This project is an AI-assisted scientific R&D platform designed to support two high-impact domains:

1. **Chemical Catalysis**
2. **Synthetic Biology**

It helps research teams move from reaction intent to actionable outputs: recommendations, pathways, simulations, optimization insights, biosafety profiling, experiment planning, and report generation.

### Why this platform exists

Modern scientific R&D is fragmented across tools and slow manual loops. This platform unifies:
- reaction intelligence
- AI-guided pathway/enzyme design
- simulation and analytics
- collaboration and auditability

into one interactive system suitable for fast prototyping, hackathon demos, and future enterprise extension.

---

## Key Features

| Feature | What it does | Scientific Value |
|---|---|---|
| Reaction Intelligence Engine | Parses reaction intent and generates domain-relevant recommendations | Faster hypothesis generation |
| AI Metabolic Pathway Generation | Produces pathway options with yield/ATP/NADH metrics | Better route selection and optimization |
| Enzyme Engineering | Suggests mutations and variant performance metrics | Improved catalytic performance |
| Protein Viewer | Interactive protein-like structural visualization | Visual mutation and active-site interpretation |
| Biosafety Analysis | Risk profiling with mitigation signals | Safer deployment planning |
| AI Analytics Dashboard | Readable KPI metrics and chart-driven insights | Judge-friendly scientific clarity |
| Autonomous Experiment Planner | Builds experiment sequences and optimization paths | Speeds lab execution planning |
| Experimental Feedback Loop | Logs observations and simulates model improvement | Demonstrates adaptive AI behavior |
| Multi-user Collaboration | Notes, comments, invites, timeline activity | Team-scale research workflows |
| Version History & Audit Trail | Expandable event timeline with comparison/restore simulation | Traceability and reproducibility |
| Commercialization Strategy | Business and deployment narrative outputs | Investor-facing product framing |

---

## System Architecture

### Frontend
- **React + Vite** for fast modular UI
- **TailwindCSS** for clean design system
- **Framer Motion** for smooth transitions
- **Recharts** for scientific visual analytics
- **Zustand** for global state persistence
- **React Router** for multi-domain navigation
- **Three.js / SVG-driven viewers** for structure visual components

### Backend
- **Node.js + Express**
- Domain APIs for catalysis/synbio mock inference
- Project, feedback, collaboration, and version-history endpoints
- JWT-based auth and scoped access patterns

### AI Mock Engine
- Reaction keyword classification
- Biological mapping and enzyme recommendation logic
- Pathway and mutation generation templates
- Confidence-scored output payloads with scientific explanations

---

## Project Structure

```text
frontend/
  src/
    api/            # HTTP client layer
    components/     # shared UI + layout + boundaries
    context/        # auth context
    data/           # static scientific mock datasets
    pages/          # route screens (Catalysis + SynBio + core app pages)
    services/       # AI mock engines / generators
    stores/         # Zustand global state
    utils/          # export helpers and utility functions
    App.jsx
    main.jsx

backend/
  ai-engine/        # research pipeline and calibration logic
  controllers/      # request handlers
  db/               # migration utilities
  middleware/       # auth/access middleware
  models/           # Mongoose schemas
  routes/           # API routes
  services/         # shared backend services
  server.js         # API entrypoint
```

---

## How To Run Locally (Critical)

### 1) Prerequisites

- Node.js `18+`
- npm `9+`
- MongoDB (local or cloud URI)

### 2) Clone repository

```bash
git clone <your-repo-url>
cd "GPS Renewables"
```

### 3) Backend setup

```bash
cd backend
cp .env.example .env
```

Set environment values in `.env`:

```env
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=5000
CLIENT_URL=http://localhost:5173
```

Run backend:

```bash
npm install
npm run dev
```

### 4) Frontend setup

```bash
cd ../frontend
cp .env.example .env
```

Set frontend environment:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm install
npm run dev
```

### 5) Open app

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## Deployment Guide

### Frontend on Vercel

1. Import repo into Vercel
2. Set root to `frontend`
3. Add env var:
   - `VITE_API_URL=https://<your-backend-domain>/api`
4. Build command: `npm run build`
5. Output directory: `dist`

### Backend on Render

1. Create Web Service from repo
2. Set root to `backend`
3. Start command: `npm start`
4. Add env vars:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` (Render injects automatically; keep fallback)
   - `CLIENT_URL=https://<your-frontend-domain>`
5. Deploy and verify `/api/health`

---

## Scientific Workflow

```text
Reaction Input
   ↓
Reaction Intelligence Analysis
   ↓
Microorganism / Catalyst Recommendation
   ↓
Enzyme + Pathway Generation
   ↓
Protein / Mutation Optimization
   ↓
Simulation + Risk Analysis
   ↓
Experimental Feedback Logging
   ↓
AI Retraining + Audit Timeline
   ↓
Report Export + Commercialization Outputs
```

---



## AI Engine Explanation

The current platform uses a modular, rule-based scientific mock inference layer designed to be replaceable with real models.

### Engines included
- **Reaction Classification Engine**: maps reaction text to domain-specific profile
- **Biological Mapping Engine**: selects microbes/enzymes by objective compatibility
- **Pathway Generation Engine**: emits pathway candidates with energy and yield metrics
- **Mutation Generation Engine**: creates enzyme variants with stability/activity scores
- **Risk Analysis Engine**: computes biosafety and deployment risk indicators

### Why this is effective in demos
- deterministic enough for reproducibility
- dynamic enough to show non-repeated scientific outputs
- structured JSON responses suitable for future LLM/model plug-ins

---

## Why This Project Matters

- 🌍 **Sustainability-first R&D** for fuels, catalysis, and biotech acceleration  
- 🧪 **Scientific automation** reduces iteration time in discovery workflows  
- 🧠 **AI-guided reasoning** improves clarity for both technical and non-technical stakeholders  
- 🏭 **Industrial relevance** with risk, scale-up, and commercialization perspectives  
- 🚀 **Startup readiness** as a foundation for next-generation AI laboratories  

---

## Future Scope

- Real LLM-assisted scientific reasoning and agentic planning
- Integration with molecular docking/folding models
- Real wet-lab LIMS + robotics orchestration
- Streaming experiment telemetry and live model adaptation
- Multi-tenant enterprise governance and role policies
- Integration with real scientific databases and instrument pipelines

---

## Contributors

- **GPS Renewables AI R&D Team**
- Project architecture, engineering, and scientific workflow design for hackathon demo delivery

---

## License

MIT License.  
Feel free to use, modify, and extend for research and educational purposes.
