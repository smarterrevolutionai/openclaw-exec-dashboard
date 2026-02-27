# OpenClaw Executive Dashboard

**Owner:** Mark & Business Partner (Executive)  
**Purpose:** Executive dashboard for managing and understanding the Smarty/Optimus system

## 🎯 Overview

This is a standalone Next.js application that provides Mark and his business partner with a unified view of the OpenClaw dual-agent system operations, costs, and performance.

## 📊 Features

- **System Status:** Real-time view of production services, agent health, and operational metrics
- **Cost Tracking:** AI model usage, infrastructure costs, and resource optimization insights
- **Agent Coordination:** Visibility into Smarty development and Optimus production operations

## 🏗 Architecture

### API Routes
- `GET /api/system-status` → Reads `/opt/smarterrevolution-infrastructure/status/system-status.json`
- `GET /api/cost-tracking` → Reads `/opt/smarterrevolution-infrastructure/status/cost-tracking.json`

### Data Sources
Data files are maintained by **Optimus** in the infrastructure repository:
- **System Status JSON:** Service health, uptime, performance metrics, agent activity
- **Cost Tracking JSON:** Model usage costs, infrastructure spend, optimization opportunities

### Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** PM2 on production VPS (port 3005)

## 🚀 Deployment

### Production Environment
- **URL:** http://72.62.252.232:3006
- **Process Manager:** PM2 (`openclaw-exec-dashboard`)
- **Port:** 3006
- **Status:** Production service (managed by Optimus)

### Local Development
```bash
npm install
npm run dev
# Access at http://localhost:3000
```

### Production Deployment
```bash
npm install --production
npm run build
npm run start
# Starts on port 3005
```

## 📂 File Structure

```
├── app/
│   ├── api/
│   │   ├── system-status/route.js    # System status API
│   │   └── cost-tracking/route.js    # Cost tracking API
│   ├── globals.css                   # Global styles
│   ├── layout.js                     # Root layout
│   └── page.js                       # Main dashboard page
├── package.json                      # Dependencies
├── next.config.js                    # Next.js configuration
├── tailwind.config.js               # Tailwind CSS configuration
└── postcss.config.js                # PostCSS configuration
```

## 🔄 Data Flow

1. **Optimus** continuously updates JSON files in `/opt/smarterrevolution-infrastructure/status/`
2. **Dashboard** fetches data via API routes every 30 seconds
3. **Executive users** see real-time system status and costs
4. **Graceful fallback** to demo data if JSON files don't exist yet

## 🎨 Dashboard Components

- **System Health Grid:** Service status, uptime, performance indicators
- **Agent Activity:** Smarty development progress, Optimus operational tasks
- **Cost Analytics:** Daily/weekly/monthly spend breakdown by model tier
- **Alert Summary:** Critical issues requiring executive attention
- **Deployment Timeline:** Recent production changes and their impact

## 🔐 Security & Access

- **Internal Network:** Dashboard accessible only from company network
- **File System Access:** Read-only access to Optimus-maintained status files
- **No Authentication:** Intended for internal executive use only

---

**Production Service Notice:** This dashboard is now part of the production software registry. All changes must go through the Smarty → Optimus → Mark approval workflow.