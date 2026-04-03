'use client'

import { useState, useEffect, useCallback } from "react";
import { Shield, Server, GitBranch, MessageSquare, AlertTriangle, CheckCircle, Clock, Zap, Bot, Eye, Rocket, ChevronRight, ChevronDown, Info, ArrowRight, Monitor, Database, Globe, Mail, Terminal, Users, DollarSign, Activity, Lock, RefreshCw, XCircle, HelpCircle, Layers, Wifi, WifiOff, TrendingUp, TrendingDown, BarChart3, PieChart, Heart, Cpu, HardDrive, MemoryStick } from "lucide-react";

// === DEMO DATA (replaced by live API when available) ===
const DEMO_STATUS = {
  timestamp: new Date().toISOString(),
  live: false,
  services: [
    { name: "CRM", status: "up", port: 3000, responseMs: 142, uptime: 99.98, lastCheck: new Date().toISOString() },
    { name: "Command Center", status: "up", port: 3001, responseMs: 89, uptime: 100, lastCheck: new Date().toISOString() },
    { name: "Website", status: "up", port: 3003, responseMs: 203, uptime: 99.99, lastCheck: new Date().toISOString() },
    { name: "Sales Scripts", status: "up", port: "cron", responseMs: null, uptime: 98.5, lastCheck: new Date().toISOString() },
    { name: "CRM Database", status: "up", port: 5433, responseMs: 12, uptime: 100, lastCheck: new Date().toISOString() },
    { name: "Redis Cache", status: "up", port: 6379, responseMs: 2, uptime: 100, lastCheck: new Date().toISOString() },
  ],
  resources: {
    cpu: 23,
    memory: 58,
    disk: 43,
    diskFreeGb: 167,
    memTotalGb: 32,
    memUsedGb: 18.6
  },
  backups: {
    lastCrm: "2026-02-27T08:00:00Z",
    lastDashboard: "2026-02-27T03:00:00Z",
    verified: true,
    lastVerified: "2026-02-27T04:00:00Z"
  },
  security: {
    lastScan: "2026-02-27T06:00:00Z",
    openIssues: 5,
    pendingUpdates: 33,
    lastPatch: null
  },
  agents: {
    smarty: {
      status: "active",
      task: "Phase 1 — committing code to GitHub",
      lastHeartbeat: new Date(Date.now()-3600000).toISOString()
    },
    optimus: {
      status: "bootstrapping",
      task: "Phase 1 — awaiting SSH access",
      lastHeartbeat: new Date(Date.now()-1800000).toISOString()
    }
  },
  rollout: {
    phase: 1,
    completedTasks: 0,
    totalTasks: 33
  }
};

const DEMO_COSTS = {
  today: { total: 4.82, smarty: 3.15, optimus: 1.67 },
  week: { total: 18.45, smarty: 12.30, optimus: 6.15 },
  month: { total: 52.30, smarty: 38.20, optimus: 14.10 },
  byModel: [
    { model: "Claude Opus 4.6", tier: "Tier 1 — Apex", cost: 18.50, calls: 42, agent: "both" },
    { model: "Claude Sonnet 4.5", tier: "Tier 2 — Workhorse", cost: 14.20, calls: 187, agent: "both" },
    { model: "Claude Haiku 4.5", tier: "Tier 3 — Utility", cost: 3.80, calls: 412, agent: "both" },
    { model: "GPT-5-nano", tier: "Tier 4 — Heartbeat", cost: 0.45, calls: 2840, agent: "both" },
    { model: "DeepSeek R1", tier: "Tier 3 — Utility", cost: 1.90, calls: 95, agent: "smarty" },
    { model: "Grok 4 Fast", tier: "Tier 3 — Utility", cost: 0.80, calls: 64, agent: "smarty" },
    { model: "Gemini 3 Flash", tier: "Tier 4 — Heartbeat", cost: 0.15, calls: 320, agent: "smarty" },
    { model: "GPT-5.3 Codex", tier: "Tier 2 — Workhorse", cost: 2.50, calls: 31, agent: "optimus" },
  ],
  daily: [
    { date: "Feb 21", total: 5.20 },
    { date: "Feb 22", total: 6.80 },
    { date: "Feb 23", total: 4.10 },
    { date: "Feb 24", total: 7.90 },
    { date: "Feb 25", total: 5.50 },
    { date: "Feb 26", total: 4.35 },
    { date: "Feb 27", total: 4.82 },
  ],
  infra: { vps: 25, external: 12, total: 37 }
};

const PHASE_DATA = [
  {
    phase: 1, title: "Foundation", days: "Days 1–5", status: "active",
    desc: "Establish access, fix security issues, set up monitoring and coordination.",
    tasks: [
      { id:"1.1", t:"Generate SSH key for Optimus", o:"Smarty", s:"pending" },
      { id:"1.2", t:"Optimus verifies SSH access to VPS", o:"Optimus", s:"pending" },
      { id:"1.3", t:"Rotate compromised API tokens", o:"Optimus", s:"pending" },
      { id:"1.4", t:"Configure Discord security settings", o:"Both", s:"pending" },
      { id:"1.5", t:"Create Discord channel structure", o:"Optimus", s:"pending" },
      { id:"1.6", t:"Commit all code to GitHub (backup)", o:"Smarty", s:"pending" },
      { id:"1.7", t:"Create missing code repositories", o:"Smarty", s:"pending" },
      { id:"1.8", t:"Set up GitHub access for both agents", o:"Both", s:"pending" },
      { id:"1.9", t:"Full system baseline assessment", o:"Optimus", s:"pending" },
      { id:"1.10", t:"Deploy basic monitoring", o:"Optimus", s:"pending" },
      { id:"1.11", t:"Begin daily Discord reports", o:"Optimus", s:"pending" },
      { id:"1.12", t:"Centralize all passwords/secrets", o:"Optimus", s:"pending" },
      { id:"1.13", t:"Apply 33 pending server updates", o:"Optimus", s:"pending" },
      { id:"1.14", t:"Fix 5 critical security issues", o:"Optimus", s:"pending" },
      { id:"1.15", t:"Set up dev/staging/production branches", o:"Smarty", s:"pending" },
    ]
  },
  {
    phase: 2, title: "Pipeline & Separation", days: "Days 6–12", status: "upcoming",
    desc: "Separate dev and production environments. Automated deployments.",
    tasks: [
      { id:"2.1", t:"Provision dev/staging server", o:"Mark", s:"pending" },
      { id:"2.2", t:"Configure dev/staging server", o:"Optimus", s:"pending" },
      { id:"2.3", t:"Migrate Smarty's work to dev server", o:"Smarty", s:"pending" },
      { id:"2.4", t:"Automated deploy: code push → staging", o:"Optimus", s:"pending" },
      { id:"2.5", t:"Automated deploy: approval → production", o:"Optimus", s:"pending" },
      { id:"2.6", t:"Automated backups with daily verification", o:"Optimus", s:"pending" },
      { id:"2.7", t:"Optimus begins reviewing Smarty's code", o:"Optimus", s:"pending" },
      { id:"2.8", t:"Performance baseline for all services", o:"Optimus", s:"pending" },
      { id:"2.9", t:"Optimize known slow database queries", o:"Optimus", s:"pending" },
      { id:"2.10", t:"Set up error tracking", o:"Optimus", s:"pending" },
    ]
  },
  {
    phase: 3, title: "Full Autonomy", days: "Days 13–21", status: "upcoming",
    desc: "Optimus fully owns production. Boundaries enforced. Continuous improvement.",
    tasks: [
      { id:"3.1", t:"Remove Smarty's production access", o:"Both", s:"pending" },
      { id:"3.2", t:"Full security audit of production", o:"Optimus", s:"pending" },
      { id:"3.3", t:"Load testing and capacity planning", o:"Optimus", s:"pending" },
      { id:"3.4", t:"Disaster recovery drill", o:"Optimus", s:"pending" },
      { id:"3.5", t:"Optimize server resource allocation", o:"Optimus", s:"pending" },
      { id:"3.6", t:"Document all production procedures", o:"Optimus", s:"pending" },
      { id:"3.7", t:"First weekly report delivered", o:"Optimus", s:"pending" },
      { id:"3.8", t:"Team retrospective — what's working?", o:"All", s:"pending" },
    ]
  }
];

const CHANNELS = [
  { name:"#exec-dashboard", icon:Monitor, color:"text-blue-400", purpose:"Your main view", desc:"Daily and weekly reports. System health, costs, what was built and fixed.", action:"Read daily. Your command center." },
  { name:"#alerts-critical", icon:AlertTriangle, color:"text-red-400", purpose:"Emergencies only", desc:"Something is down or a security issue. You'll get pinged. Rare but important.", action:"Respond when pinged. React ✅ or ❌." },
  { name:"#alerts-info", icon:Info, color:"text-green-400", purpose:"Good news & FYI", desc:"Deploys done, backups verified, patches applied. No action needed.", action:"Skim occasionally." },
  { name:"#smarty-optimus", icon:Bot, color:"text-purple-400", purpose:"Agent coordination", desc:"Smarty and Optimus coordinate here. You can observe.", action:"Observe only." },
  { name:"#deployment-log", icon:Rocket, color:"text-amber-400", purpose:"Deployments", desc:"New features going live need your approval here.", action:"React ✅ to approve, ❌ to reject." },
  { name:"#dev-reviews", icon:Eye, color:"text-cyan-400", purpose:"Code quality", desc:"Optimus reviews Smarty's code. Quality control reports.", action:"Optional reading." },
  { name:"#requests", icon:MessageSquare, color:"text-emerald-400", purpose:"Your command line", desc:"Give instructions to either agent. Plain English works.", action:"Where you give orders." },
];

const COMMANDS = [
  { cmd:"What's the status of everything?", who:"@Optimus", result:"Full system health report" },
  { cmd:"How much are we spending on AI?", who:"@Optimus", result:"Cost breakdown by model and agent" },
  { cmd:"What is Smarty working on?", who:"@Smarty", result:"Current projects and progress" },
  { cmd:"Pause all deployments until Monday", who:"Both", result:"Both agents acknowledge and hold" },
  { cmd:"Approve deployment of CRM v1.5.2", who:"@Optimus", result:"Optimus deploys to production" },
  { cmd:"Is the CRM running ok?", who:"@Optimus", result:"Health check with response times" },
  { cmd:"Build a new feature that does X", who:"@Smarty", result:"Smarty begins development" },
  { cmd:"What happened with that alert?", who:"@Optimus", result:"Incident explanation in plain English" },
];

const GLOSSARY = [
  { term:"VPS", plain:"Virtual Private Server — a computer in the cloud where your software runs. Like renting a powerful computer that's always on." },
  { term:"Docker Container", plain:"A packaged box holding one piece of software and everything it needs. Self-contained and portable." },
  { term:"PM2", plain:"A watchdog for your apps. If one crashes, PM2 automatically restarts it." },
  { term:"PostgreSQL", plain:"The database storing your business data — contacts, deals, activities. A digital filing cabinet." },
  { term:"Git / GitHub", plain:"Version history for software. Like Google Docs history but for code. GitHub stores it online." },
  { term:"Branch (main/dev/staging)", plain:"Different versions of code. 'main' is live, 'dev' is experimental, 'staging' is final testing." },
  { term:"PR (Pull Request)", plain:"A formal request to move code between branches. Like submitting a document for review." },
  { term:"CI/CD Pipeline", plain:"Automated assembly line for software. Code goes in, gets tested, comes out deployed. No manual steps." },
  { term:"SSL Certificate", plain:"The padlock in your browser. Encrypts data between users and your site." },
  { term:"Rollback", plain:"Undoing a deployment. Instantly switches back to the last working version. An undo button for your app." },
  { term:"API Key / Token", plain:"A password that lets software talk to other software. A VIP pass for authorization." },
  { term:"Cron Job", plain:"A scheduled task that runs automatically. Like an alarm: 'run this report every morning at 6 AM.'" },
  { term:"Subagent", plain:"A helper an agent creates for a specific task. Like delegating to a junior employee." },
  { term:"Tier 1/2/3 (Escalation)", plain:"How urgent. Tier 1: auto-fixed. Tier 2: you're told first. Tier 3: you must approve." },
  { term:"Heartbeat", plain:"A regular 'I'm alive' signal every 4 hours. If one stops, the other raises an alarm." },
];

// === COMPONENTS ===
const Badge = ({ children, variant = "default" }) => {
  const s = {
    critical:"bg-red-500/20 text-red-400 border-red-500/30",
    high:"bg-amber-500/20 text-amber-400 border-amber-500/30",
    up:"bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    down:"bg-red-500/20 text-red-400 border-red-500/30",
    degraded:"bg-amber-500/20 text-amber-400 border-amber-500/30",
    active:"bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    upcoming:"bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    pending:"bg-zinc-700/50 text-zinc-400 border-zinc-600/30",
    complete:"bg-blue-500/20 text-blue-400 border-blue-500/30",
    bootstrapping:"bg-amber-500/20 text-amber-400 border-amber-500/30",
    default:"bg-zinc-700/50 text-zinc-300 border-zinc-600/30",
    Smarty:"bg-violet-500/20 text-violet-300 border-violet-500/30",
    Optimus:"bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    Both:"bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    Mark:"bg-amber-500/20 text-amber-300 border-amber-500/30",
    All:"bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${s[variant]||s.default}`}>{children}</span>;
};

const Card = ({ children, className = "" }) => <div className={`bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700/50 ${className}`}>{children}</div>;

const Metric = ({ label, value, unit, icon: Icon, color = "text-white", sub }) => (
  <div className="text-center">
    {Icon && <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`}/>}
    <div className={`text-2xl font-bold ${color}`}>{value}<span className="text-sm font-normal text-zinc-400">{unit}</span></div>
    <div className="text-xs text-zinc-400">{label}</div>
    {sub && <div className="text-xs text-zinc-500 mt-0.5">{sub}</div>}
  </div>
);

const ProgressBar = ({ value, max = 100, color = "emerald", size = "md" }) => {
  const c = value > 90 ? "red" : value > 80 ? "amber" : color;
  const colors = {
    emerald:"from-emerald-500 to-cyan-500",
    amber:"from-amber-500 to-orange-500", 
    red:"from-red-500 to-rose-500",
    blue:"from-blue-500 to-indigo-500",
    violet:"from-violet-500 to-purple-500",
    cyan:"from-cyan-500 to-blue-500"
  };
  return (
    <div className={`w-full bg-zinc-700 rounded-full overflow-hidden ${size==="sm"?"h-1.5":"h-3"}`}>
      <div className={`bg-gradient-to-r ${colors[c]||colors.emerald} h-full rounded-full transition-all duration-500`} style={{width:`${Math.min(value,max)/max*100}%`}}/>
    </div>
  );
};

const timeAgo = (iso) => {
  if (!iso) return "never";
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d/60)}m ago`;
  if (d < 86400) return `${Math.floor(d/3600)}h ago`;
  return `${Math.floor(d/86400)}d ago`;
};

const tabs = [
  { id:"status", label:"Live Status", icon:Activity },
  { id:"costs", label:"Cost Tracking", icon:DollarSign },
  { id:"overview", label:"How It Works", icon:Layers },
  { id:"agents", label:"Agents", icon:Bot },
  { id:"services", label:"Services", icon:Server },
  { id:"rollout", label:"Rollout Plan", icon:Rocket },
  { id:"discord", label:"Discord Guide", icon:MessageSquare },
  { id:"commands", label:"Commands", icon:Terminal },
  { id:"decisions", label:"Your Decisions", icon:CheckCircle },
  { id:"glossary", label:"Glossary", icon:HelpCircle },
];

export default function Dashboard() {
  const [tab, setTab] = useState("status");
  const [status, setStatus] = useState(DEMO_STATUS);
  const [costs, setCosts] = useState(DEMO_COSTS);
  const [isLive, setIsLive] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  const [expPhase, setExpPhase] = useState(1);
  const [expGloss, setExpGloss] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const r = await fetch("/api/system-status");
      if (r.ok) {
        const d = await r.json();
        setStatus({...d, live:true});
        setIsLive(true);
      }
    } catch {
      setIsLive(false);
    }
    
    try {
      const r = await fetch("/api/cost-tracking");
      if (r.ok) {
        const d = await r.json();
        setCosts(d);
      }
    } catch {}
    
    setLastFetch(new Date().toISOString());
  }, []);

  useEffect(() => {
    fetchData();
    const i = setInterval(fetchData, 60000);
    return () => clearInterval(i);
  }, [fetchData]);

  const allUp = status.services.every(s => s.status === "up");
  const totalTasks = PHASE_DATA.reduce((a,p)=>a+p.tasks.length,0);
  const completedTasks = PHASE_DATA.reduce((a,p)=>a+p.tasks.filter(t=>t.s==="complete").length,0);

  // === TAB: LIVE STATUS ===
  const renderStatus = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLive ? <Wifi className="w-4 h-4 text-emerald-400"/> : <WifiOff className="w-4 h-4 text-zinc-500"/>}
          <span className={`text-xs ${isLive?"text-emerald-400":"text-zinc-500"}`}>{isLive ? "Live — auto-refreshing every 60s" : "Demo data — live API not connected yet"}</span>
        </div>
        <button onClick={fetchData} className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"><RefreshCw className="w-3 h-3"/>Refresh</button>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-4 h-4 rounded-full ${allUp?"bg-emerald-400 animate-pulse":"bg-red-400 animate-pulse"}`}/>
          <h3 className="text-lg font-bold text-white">{allUp?"All Systems Operational":"⚠️ Issues Detected"}</h3>
        </div>
        <div className="space-y-2">
          {status.services.map(svc => (
            <div key={svc.name} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-700/30">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${svc.status==="up"?"bg-emerald-400":"bg-red-400"}`}/>
                <span className="text-sm font-medium text-white">{svc.name}</span>
                <span className="text-xs text-zinc-500">:{svc.port}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                {svc.responseMs !== null && <span className="text-zinc-400">{svc.responseMs}ms</span>}
                <span className="text-zinc-400">{svc.uptime}% uptime</span>
                <Badge variant={svc.status}>{svc.status.toUpperCase()}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <h4 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2"><Cpu className="w-4 h-4"/>Server Resources</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-zinc-300">CPU</span><span className="text-white font-medium">{status.resources.cpu}%</span></div>
              <ProgressBar value={status.resources.cpu}/>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-zinc-300">Memory</span><span className="text-white font-medium">{status.resources.memory}%</span></div>
              <ProgressBar value={status.resources.memory}/>
              <div className="text-xs text-zinc-500 mt-0.5">{status.resources.memUsedGb}GB / {status.resources.memTotalGb}GB</div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-zinc-300">Disk</span><span className="text-white font-medium">{status.resources.disk}%</span></div>
              <ProgressBar value={status.resources.disk}/>
              <div className="text-xs text-zinc-500 mt-0.5">{status.resources.diskFreeGb}GB free</div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2"><Database className="w-4 h-4"/>Backups</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-300">CRM Database</span>
              <span className="text-xs text-zinc-400">{timeAgo(status.backups.lastCrm)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-300">Command Center DB</span>
              <span className="text-xs text-zinc-400">{timeAgo(status.backups.lastDashboard)}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-700/30">
              {status.backups.verified ? <CheckCircle className="w-4 h-4 text-emerald-400"/> : <AlertTriangle className="w-4 h-4 text-amber-400"/>}
              <span className={`text-sm ${status.backups.verified?"text-emerald-400":"text-amber-400"}`}>
                {status.backups.verified ? "Verified" : "Unverified"} · {timeAgo(status.backups.lastVerified)}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2"><Shield className="w-4 h-4"/>Security</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-300">Open Issues</span>
              <Badge variant={status.security.openIssues > 0 ? "critical" : "up"}>{status.security.openIssues}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-300">Pending Updates</span>
              <Badge variant={status.security.pendingUpdates > 10 ? "high" : "up"}>{status.security.pendingUpdates}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-300">Last Scan</span>
              <span className="text-xs text-zinc-400">{timeAgo(status.security.lastScan)}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label:"Smarty", data: status.agents.smarty, color:"violet", icon: Bot },
          { label:"Optimus", data: status.agents.optimus, color:"cyan", icon: Shield }
        ].map(a => (
          <Card key={a.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-${a.color}-500/20 rounded-lg`} style={{background:`rgba(${a.color==="violet"?"139,92,246":"6,182,212"},0.15)`}}>
                <a.icon className="w-5 h-5" style={{color:a.color==="violet"?"#a78bfa":"#22d3ee"}}/>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{a.label}</span>
                  <Badge variant={a.data.status}>{a.data.status}</Badge>
                </div>
                <div className="text-sm text-zinc-400 mt-0.5">{a.data.task}</div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-zinc-500"><Heart className="w-3 h-3"/>{timeAgo(a.data.lastHeartbeat)}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-zinc-400 flex items-center gap-2"><Rocket className="w-4 h-4"/>Rollout Progress</h4>
          <span className="text-xs text-zinc-500">Phase {status.rollout.phase} of 3</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1"><ProgressBar value={completedTasks} max={totalTasks} color="blue"/></div>
          <span className="text-sm text-zinc-400 whitespace-nowrap">{completedTasks}/{totalTasks}</span>
        </div>
      </Card>
    </div>
  );

  // === TAB: COST TRACKING ===
  const renderCosts = () => {
    const maxDaily = Math.max(...costs.daily.map(d=>d.total));
    const sortedModels = [...costs.byModel].sort((a,b)=>b.cost-a.cost);
    const totalModelCost = sortedModels.reduce((a,m)=>a+m.cost,0);

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label:"Today", val:`$${costs.today.total.toFixed(2)}`, sub:`S: $${costs.today.smarty.toFixed(2)} · O: $${costs.today.optimus.toFixed(2)}`, color:"text-white" },
            { label:"This Week", val:`$${costs.week.total.toFixed(2)}`, sub:`S: $${costs.week.smarty.toFixed(2)} · O: $${costs.week.optimus.toFixed(2)}`, color:"text-white" },
            { label:"This Month", val:`$${costs.month.total.toFixed(2)}`, sub:`S: $${costs.month.smarty.toFixed(2)} · O: $${costs.month.optimus.toFixed(2)}`, color:"text-white" },
            { label:"Infra (Monthly)", val:`$${costs.infra.total}/mo`, sub:`VPS: $${costs.infra.vps} · Services: $${costs.infra.external}`, color:"text-zinc-300" },
          ].map((c,i) => (
            <Card key={i} className="p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">{c.label}</div>
              <div className={`text-2xl font-bold ${c.color}`}>{c.val}</div>
              <div className="text-xs text-zinc-500 mt-1">{c.sub}</div>
            </Card>
          ))}
        </div>

        <Card className="p-5">
          <h4 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4"/>Daily API Spend (Last 7 Days)</h4>
          <div className="flex items-end gap-2 h-40">
            {costs.daily.map((d,i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-zinc-400">${d.total.toFixed(0)}</span>
                <div className="w-full bg-zinc-700 rounded-t-md overflow-hidden flex flex-col justify-end" style={{height:"120px"}}>
                  <div className="bg-gradient-to-t from-cyan-500 to-violet-500 rounded-t-md transition-all duration-500" style={{height:`${(d.total/maxDaily)*100}%`}}/>
                </div>
                <span className="text-xs text-zinc-500">{d.date.split(" ")[1]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2"><PieChart className="w-4 h-4"/>Cost by Model (This Month)</h4>
          <div className="space-y-2">
            {sortedModels.map((m,i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-900/50">
                <div className="w-32 text-sm text-zinc-300 font-medium truncate">{m.model}</div>
                <div className="flex-1"><ProgressBar value={m.cost} max={totalModelCost} color={i<2?"violet":i<4?"cyan":"emerald"} size="sm"/></div>
                <div className="w-16 text-right text-sm text-white font-medium">${m.cost.toFixed(2)}</div>
                <div className="w-20 text-right text-xs text-zinc-500">{m.calls.toLocaleString()} calls</div>
                <Badge variant={m.agent==="smarty"?"Smarty":m.agent==="optimus"?"Optimus":"Both"}>{m.agent}</Badge>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-700/30 flex justify-between text-sm">
            <span className="text-zinc-400">Total AI API Cost</span>
            <span className="text-white font-bold">${totalModelCost.toFixed(2)}</span>
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2"><Zap className="w-4 h-4"/>Agent Cost Breakdown</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg border border-violet-500/20 bg-violet-500/5">
              <Bot className="w-6 h-6 text-violet-400 mx-auto mb-2"/>
              <div className="text-xl font-bold text-white">${costs.month.smarty.toFixed(2)}</div>
              <div className="text-xs text-zinc-400">Smarty · This Month</div>
              <div className="text-xs text-violet-300 mt-1">{((costs.month.smarty/costs.month.total)*100).toFixed(0)}% of total</div>
            </div>
            <div className="text-center p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
              <Shield className="w-6 h-6 text-cyan-400 mx-auto mb-2"/>
              <div className="text-xl font-bold text-white">${costs.month.optimus.toFixed(2)}</div>
              <div className="text-xs text-zinc-400">Optimus · This Month</div>
              <div className="text-xs text-cyan-300 mt-1">{((costs.month.optimus/costs.month.total)*100).toFixed(0)}% of total</div>
            </div>
          </div>
        </Card>

        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/30">
          <p className="text-sm text-zinc-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0"/>
            <span><strong className="text-zinc-300">How to read this:</strong> Most spending goes to Tier 1-2 models (Claude Opus and Sonnet) which handle complex work. Tier 4 models (GPT-5-nano, Gemini Flash) handle thousands of simple tasks for pennies. If costs spike, it usually means more development activity — not waste.</span>
          </p>
        </div>
      </div>
    );
  };

  // === TAB: OVERVIEW ===
  const renderOverview = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon:Bot, color:"violet", role:"Development Agent", name:"Smarty", desc:"Builds features, creates automations, develops new software. 1 month operational.", status:"Operational", statusColor:"emerald" },
          { icon:Shield, color:"cyan", role:"Production Agent", name:"Optimus", desc:"Guards production. Monitors, deploys safely, fixes issues, optimizes performance.", status:"Bootstrapping", statusColor:"amber" },
          { icon:Users, color:"amber", role:"Executive", name:"Mark", desc:"Strategic direction, approvals, oversight. Manages via Discord.", status:"In Control", statusColor:"emerald" },
        ].map(a => (
          <Card key={a.name} className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg" style={{background:`rgba(${a.color==="violet"?"139,92,246":a.color==="cyan"?"6,182,212":"245,158,11"},0.15)`}}>
                <a.icon className="w-5 h-5" style={{color:a.color==="violet"?"#a78bfa":a.color==="cyan"?"#22d3ee":"#fbbf24"}}/>
              </div>
              <div>
                <div className="text-sm text-zinc-400">{a.role}</div>
                <div className="text-lg font-semibold text-white">{a.name}</div>
              </div>
            </div>
            <p className="text-sm text-zinc-400">{a.desc}</p>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full animate-pulse`} style={{background:a.statusColor==="emerald"?"#34d399":"#fbbf24"}}/>
              <span style={{color:a.statusColor==="emerald"?"#34d399":"#fbbf24"}}>{a.status}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-blue-400"/>How It All Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center text-sm">
          {[
            { icon:Bot, color:"#a78bfa", bg:"rgba(139,92,246,0.1)", border:"rgba(139,92,246,0.3)", t:"Smarty Builds", sub:"New features on dev branch" },
            null,
            { icon:Eye, color:"#22d3ee", bg:"rgba(6,182,212,0.1)", border:"rgba(6,182,212,0.3)", t:"Optimus Reviews", sub:"Security, performance, stability" },
            null,
            { icon:CheckCircle, color:"#fbbf24", bg:"rgba(245,158,11,0.1)", border:"rgba(245,158,11,0.3)", t:"Mark Approves", sub:"✅ in Discord → goes live" },
          ].map((s,i) => s ? (
            <div key={i} className="rounded-lg p-4 border" style={{background:s.bg,borderColor:s.border}}>
              <s.icon className="w-6 h-6 mx-auto mb-2" style={{color:s.color}}/>
              <div className="text-white font-medium">{s.t}</div>
              <div className="text-zinc-400 text-xs mt-1">{s.sub}</div>
            </div>
          ) : <div key={i} className="hidden md:block text-zinc-500"><ChevronRight className="w-6 h-6 mx-auto"/></div>)}
        </div>
        <div className="mt-4 bg-zinc-900/50 rounded-lg p-3 border border-zinc-700/30">
          <div className="flex items-start gap-2"><RefreshCw className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0"/><p className="text-sm text-zinc-400"><span className="text-emerald-400 font-medium">Auto-Protection:</span> If a deployment causes problems, Optimus automatically rolls back and alerts you.</p></div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><Shield className="w-5 h-5 text-red-400"/>Escalation Tiers</h3>
        <div className="space-y-3">
          {[
            { tier:"Tier 1 — Auto-Fix", c:"#34d399", bg:"rgba(16,185,129,0.05)", border:"rgba(16,185,129,0.2)", desc:"Optimus handles it. You're notified after.", ex:"Restart crashed app, clear disk space, renew SSL cert", action:"No action needed. Read in #alerts-info." },
            { tier:"Tier 2 — Heads Up", c:"#fbbf24", bg:"rgba(245,158,11,0.05)", border:"rgba(245,158,11,0.2)", desc:"Optimus alerts you first, waits 15 min, then acts if urgent.", ex:"Security patches, rolling back a bad deploy", action:"Respond in #alerts-critical within 15 min." },
            { tier:"Tier 3 — Your Call", c:"#f87171", bg:"rgba(239,68,68,0.05)", border:"rgba(239,68,68,0.2)", desc:"Nothing happens until you approve.", ex:"New costs, database structure changes, password rotation", action:"Must approve in #exec-dashboard. React ✅ or ❌." },
          ].map(t => (
            <div key={t.tier} className="rounded-lg p-3 border" style={{background:t.bg,borderColor:t.border}}>
              <span className="font-medium text-sm" style={{color:t.c}}>{t.tier}</span>
              <p className="text-sm text-zinc-300 mt-1">{t.desc}</p>
              <p className="text-xs text-zinc-500 mt-1">Examples: {t.ex}</p>
              <p className="text-xs mt-2 font-medium" style={{color:t.c}}>→ {t.action}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // === TAB: AGENTS ===
  const renderAgents = () => (
    <div className="space-y-5">
      {[
        { name:"Smarty", role:"The Builder", sub:"Development Agent · 1 Month Operational", icon:Bot, color:"violet", cHex:"#a78bfa", bg:"rgba(139,92,246,0.1)", does:["Builds new features and tools","Creates sales automations","Develops integrations","Rapid prototyping","Works on dev/staging only"], doesnt:["Deploy to production directly","Touch production databases","Change live server config","Restart production services","Access production secrets"], analogy:"Your product developer. Builds the house but doesn't manage electrical or plumbing once people move in." },
        { name:"Optimus", role:"The Guardian", sub:"Production Agent · Day 1", icon:Shield, color:"cyan", cHex:"#22d3ee", bg:"rgba(6,182,212,0.1)", does:["Monitors all production 24/7","Deploys code safely (your approval)","Manages backups and recovery","Fixes security vulnerabilities","Optimizes performance","Reviews Smarty's code","Auto-fixes minor issues","Sends daily and weekly reports"], doesnt:["Build new features","Make product decisions","Change how features work","Spend money without approval","Override your decisions"], analogy:"Your building manager and security guard. Keeps lights on, doors locked, everything running. Calls you for big decisions." }
      ].map(a => (
        <Card key={a.name} className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl" style={{background:a.bg}}><a.icon className="w-7 h-7" style={{color:a.cHex}}/></div>
            <div><h3 className="text-xl font-bold text-white">{a.name} — {a.role}</h3><p className="text-sm" style={{color:a.cHex}}>{a.sub}</p></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-1"><CheckCircle className="w-4 h-4"/>What {a.name} Does</h4>
              <ul className="space-y-1.5 text-sm text-zinc-300">{a.does.map((t,i)=><li key={i} className="flex items-start gap-2"><span className="text-emerald-400 mt-1">•</span>{t}</li>)}</ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-1"><XCircle className="w-4 h-4"/>What {a.name} Doesn't Do</h4>
              <ul className="space-y-1.5 text-sm text-zinc-300">{a.doesnt.map((t,i)=><li key={i} className="flex items-start gap-2"><span className="text-red-400 mt-1">•</span>{t}</li>)}</ul>
            </div>
          </div>
          <div className="mt-4 rounded-lg p-3" style={{background:a.bg}}><p className="text-sm" style={{color:a.cHex}}><strong>Think of {a.name} as:</strong> {a.analogy}</p></div>
        </Card>
      ))}

      <Card className="p-5">
        <h3 className="text-white font-semibold mb-3">How They Work Together</h3>
        <div className="space-y-2 text-sm">
          {[
            { q:"Smarty finishes a new feature", a:"Submits → Optimus reviews → Discord for your approval → Optimus deploys live" },
            { q:"CRM goes down at 3 AM", a:"Optimus detects in 60s → auto-restarts → notifies you in the morning" },
            { q:"Smarty writes insecure code", a:"Optimus catches in review → flags in Discord → Smarty fixes before production" },
            { q:"Database getting slow", a:"Optimus optimizes directly → reports improvement in daily summary" },
            { q:"They disagree", a:"Both post positions to #exec-dashboard → You decide → They comply" },
          ].map((s,i) => (
            <div key={i} className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-700/30">
              <p className="text-zinc-300 font-medium">{s.q}</p>
              <p className="text-zinc-400 mt-1 flex items-start gap-2"><ArrowRight className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0"/>{s.a}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // === TAB: SERVICES ===
  const SVC_ICONS = { CRM: Users, "Command Center": Terminal, Website: Globe, "Sales Scripts": Zap, "Cold Email": Mail, "CRM Database": Database };
  
  const renderServices = () => (
    <div className="space-y-3">
      <p className="text-sm text-zinc-400">Production systems Optimus monitors and protects, running on server 72.62.252.232.</p>
      {[
        { n:"CRM", port:"3000", tech:"Next.js + PostgreSQL", p:"critical", d:"Sales pipeline, contacts, deals — your core business tool" },
        { n:"Command Center", port:"3001", tech:"Docker + PostgreSQL", p:"critical", d:"Smarty's mission control — agent operations dashboard" },
        { n:"Website", port:"3003", tech:"Next.js", p:"high", d:"Public-facing lead generation and AI visibility assessments" },
        { n:"Sales Scripts", port:"cron", tech:"Node.js (15+ scripts)", p:"high", d:"Automated pipeline processing, lead scoring, reporting" },
        { n:"Cold Email", port:"external", tech:"PlusVibe + Inframail", p:"high", d:"12 active campaigns, 80 mailboxes across 20 domains" },
        { n:"CRM Database", port:"5433", tech:"PostgreSQL", p:"critical", d:"All your business data — contacts, deals, activities" },
      ].map(s => {
        const I = SVC_ICONS[s.n]||Server;
        return (
          <Card key={s.n} className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-700/50 rounded-lg"><I className="w-5 h-5 text-zinc-300"/></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{s.n}</span>
                  <Badge variant={s.p}>{s.p}</Badge>
                  <span className="text-xs text-zinc-500">:{s.port}</span>
                </div>
                <p className="text-sm text-zinc-400">{s.d}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  // === TAB: ROLLOUT ===
  const renderRollout = () => (
    <div className="space-y-3">
      {PHASE_DATA.map(p => (
        <Card key={p.phase} className={p.status==="active"?"border-emerald-500/30":""}>
          <button onClick={()=>setExpPhase(expPhase===p.phase?null:p.phase)} className="w-full p-4 text-left flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${p.status==="active"?"bg-emerald-500/20 text-emerald-400":"bg-zinc-700/50 text-zinc-400"}`}>{p.phase}</div>
              <div>
                <div className="text-white font-semibold flex items-center gap-2">{p.title} <Badge variant={p.status}>{p.status}</Badge></div>
                <div className="text-sm text-zinc-400">{p.days} — {p.desc}</div>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-zinc-400 transition-transform ${expPhase===p.phase?"rotate-90":""}`}/>
          </button>
          {expPhase===p.phase && (
            <div className="px-4 pb-4 border-t border-zinc-700/30 pt-3 space-y-1.5">
              {p.tasks.map(t => (
                <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-700/20">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${t.s==="complete"?"bg-emerald-500/20 border-emerald-500/50":"border-zinc-600"}`}>
                    {t.s==="complete" && <CheckCircle className="w-3.5 h-3.5 text-emerald-400"/>}
                  </div>
                  <span className="text-xs text-zinc-500 font-mono w-8">{t.id}</span>
                  <span className={`text-sm flex-1 ${t.s==="complete"?"text-zinc-500 line-through":"text-zinc-300"}`}>{t.t}</span>
                  <Badge variant={t.o}>{t.o}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );

  // === TAB: DISCORD ===
  const renderDiscord = () => (
    <div className="space-y-3">
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
        <p className="text-sm text-indigo-200">Check <strong>#exec-dashboard</strong> daily and respond to <strong>#alerts-critical</strong> when pinged. Everything else is optional.</p>
      </div>
      
      {CHANNELS.map(ch => (
        <Card key={ch.name} className="p-4">
          <div className="flex items-center gap-3 mb-1.5">
            <ch.icon className={`w-5 h-5 ${ch.color}`}/>
            <span className="text-white font-semibold">{ch.name}</span>
            <span className="text-xs text-zinc-500 bg-zinc-700/50 px-2 py-0.5 rounded-full">{ch.purpose}</span>
          </div>
          <p className="text-sm text-zinc-300 ml-8">{ch.desc}</p>
          <p className="text-sm mt-1.5 ml-8 font-medium text-emerald-400">→ {ch.action}</p>
        </Card>
      ))}

      <Card className="p-4">
        <h4 className="text-white font-semibold mb-2">Daily Routine (5 min)</h4>
        <div className="space-y-1.5 text-sm text-zinc-300">
          <p>☀️ <strong>Morning:</strong> Check #exec-dashboard daily report. All green? Done.</p>
          <p>📋 <strong>As needed:</strong> React ✅/❌ to approvals in #deployment-log or #alerts-critical.</p>
          <p>💬 <strong>Commands:</strong> Type in #requests. Tag @Smarty or @Optimus.</p>
          <p>📊 <strong>Monday:</strong> Read weekly report. ~2 min.</p>
        </div>
      </Card>
    </div>
  );

  // === TAB: COMMANDS ===
  const renderCommands = () => (
    <div className="space-y-3">
      <p className="text-sm text-zinc-400">Type in <strong>#requests</strong>. Plain English — no technical knowledge needed.</p>
      
      {COMMANDS.map((c,i) => (
        <Card key={i} className="p-3">
          <div className="flex items-start gap-3">
            <Terminal className="w-4 h-4 text-emerald-400 mt-1 shrink-0"/>
            <div className="flex-1">
              <p className="text-white font-mono text-sm">"{c.cmd}"</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant={c.who.replace("@","")}>{c.who}</Badge>
                <span className="text-xs text-zinc-400">→ {c.result}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
        <p className="text-sm text-emerald-200">💡 Just type naturally. "Hey @Optimus, is everything okay?" works fine.</p>
      </div>
    </div>
  );

  // === TAB: DECISIONS ===
  const renderDecisions = () => (
    <div className="space-y-3">
      {[
        { type:"Deployment Approval", ch:"#deployment-log", freq:"Few times/week", how:"React ✅ or ❌. Optimus already reviewed the code.", tip:"Ask \"@Optimus is this safe?\" if unsure." },
        { type:"Infrastructure Spending", ch:"#exec-dashboard", freq:"Rare (monthly)", how:"Optimus proposes with cost and benefit. Reply to approve.", tip:"Optimus never spends without asking." },
        { type:"Security Decisions", ch:"#alerts-critical", freq:"Rare", how:"Optimus explains issue and proposed fix. Approve to proceed.", tip:"When in doubt, approve security fixes." },
        { type:"Conflict Resolution", ch:"#exec-dashboard", freq:"Very rare", how:"Both agents present positions. You pick.", tip:"Ask each to explain in plain English." },
        { type:"Production Promotion", ch:"#exec-dashboard", freq:"Occasional", how:"New project ready to be treated as production. Confirm to add.", tip:"This just means Optimus starts protecting it." },
      ].map((d,i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-white font-semibold">{d.type}</span>
            <span className="text-xs text-zinc-500 bg-zinc-700/50 px-2 py-0.5 rounded-full">{d.freq}</span>
          </div>
          <p className="text-sm text-zinc-300">{d.how}</p>
          <p className="text-xs text-zinc-500 mt-1">Channel: <strong className="text-zinc-400">{d.ch}</strong></p>
          <div className="mt-2 bg-zinc-900/50 rounded p-2 border border-zinc-700/30">
            <p className="text-xs text-amber-300">💡 {d.tip}</p>
          </div>
        </Card>
      ))}
    </div>
  );

  // === TAB: GLOSSARY ===
  const renderGlossary = () => (
    <div className="space-y-1.5">
      <p className="text-sm text-zinc-400 mb-3">Technical terms in plain English. Tap to expand.</p>
      
      {GLOSSARY.map((g,i) => (
        <button key={i} onClick={()=>setExpGloss(expGloss===i?null:i)} className="w-full text-left bg-zinc-800/80 rounded-lg border border-zinc-700/50 p-3 hover:border-zinc-600/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium text-sm">{g.term}</span>
            <ChevronRight className={`w-4 h-4 text-zinc-400 transition-transform ${expGloss===i?"rotate-90":""}`}/>
          </div>
          {expGloss===i && <p className="text-sm text-zinc-400 mt-2 border-t border-zinc-700/30 pt-2">{g.plain}</p>}
        </button>
      ))}
    </div>
  );

  const renderers = {
    status:renderStatus,
    costs:renderCosts,
    overview:renderOverview,
    agents:renderAgents,
    services:renderServices,
    rollout:renderRollout,
    discord:renderDiscord,
    commands:renderCommands,
    decisions:renderDecisions,
    glossary:renderGlossary
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-b border-zinc-700/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500/30 to-cyan-500/30 rounded-xl">
              <Zap className="w-6 h-6 text-white"/>
            </div>
            <div>
              <h1 className="text-xl font-bold">OpenClaw Executive Dashboard</h1>
              <p className="text-sm text-zinc-400">Smarter Revolution · Dual-Agent Operations</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLive?"bg-emerald-400 animate-pulse":"bg-zinc-500"}`}/>
              <span className="text-xs text-zinc-400">{isLive?"Live":"Demo"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex gap-1 overflow-x-auto pb-2 mb-5 border-b border-zinc-800">
          {tabs.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${tab===t.id?"bg-zinc-800 text-white":"text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"}`}>
              <t.icon className="w-4 h-4"/>{t.label}
            </button>
          ))}
        </div>

        {renderers[tab]?.()}
      </div>
    </div>
  );
}