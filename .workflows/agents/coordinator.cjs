/**
 * Ultra Plan Agent Coordinator
 * DWS IQ 6 - V1.0 Development Sprint
 * 
 * Usage:
 *   node coordinator.js status          - Show all agent statuses
 *   node coordinator.js signals         - Show signal log
 *   node coordinator.js ready           - Show which agents are ready to launch
 *   node coordinator.js emit <agent> <signal>  - Emit a signal
 *   node coordinator.js launch <phase>  - Show launch instructions for phase
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, 'AGENT_SIGNAL_REGISTRY.json');

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function loadRegistry() {
  try {
    const data = fs.readFileSync(REGISTRY_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`${colors.red}Error loading registry: ${err.message}${colors.reset}`);
    process.exit(1);
  }
}

function saveRegistry(registry) {
  registry.last_updated = new Date().toISOString();
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
}

function getStatusIcon(status) {
  switch (status) {
    case 'running': return `${colors.green}🟢 RUNNING${colors.reset}`;
    case 'waiting': return `${colors.yellow}⏳ WAITING${colors.reset}`;
    case 'complete': return `${colors.green}✅ COMPLETE${colors.reset}`;
    case 'deferred': return `${colors.gray}🔒 DEFERRED${colors.reset}`;
    default: return status;
  }
}

function getPriorityIcon(priority) {
  switch (priority) {
    case 'critical': return `${colors.red}🔴${colors.reset}`;
    case 'high': return `${colors.yellow}🟡${colors.reset}`;
    case 'medium': return `${colors.blue}🔵${colors.reset}`;
    case 'low': return `${colors.gray}⚪${colors.reset}`;
    default: return '';
  }
}

function showStatus() {
  const registry = loadRegistry();
  const launchDate = new Date(registry.launch_date);
  const today = new Date();
  const daysRemaining = Math.ceil((launchDate - today) / (1000 * 60 * 60 * 24));

  console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}  🚀 ULTRA PLAN AGENT COORDINATOR - DWS IQ 6 V1.0${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`  Launch Date: ${colors.bright}${registry.launch_date}${colors.reset} (${colors.yellow}${daysRemaining} days remaining${colors.reset})`);
  console.log(`  Last Updated: ${registry.last_updated}`);
  console.log(`${colors.cyan}───────────────────────────────────────────────────────────────${colors.reset}\n`);

  // Group by phase
  const phases = ['1', '2', '3', '4', 'v1.1'];
  
  for (const phaseNum of phases) {
    const phaseAgents = Object.entries(registry.agents)
      .filter(([_, agent]) => String(agent.phase) === phaseNum);
    
    if (phaseAgents.length === 0) continue;

    const phaseName = phaseNum === 'v1.1' ? 'V1.1 (Deferred)' : `Phase ${phaseNum}`;
    console.log(`${colors.bright}${colors.blue}▸ ${phaseName}${colors.reset}`);
    
    for (const [id, agent] of phaseAgents) {
      const statusIcon = getStatusIcon(agent.status);
      const priorityIcon = getPriorityIcon(agent.priority);
      const emitted = agent.signals.emitted?.length || 0;
      const pending = agent.signals.pending?.length || 0;
      
      console.log(`  ${priorityIcon} ${colors.bright}${id.toUpperCase()}${colors.reset}: ${agent.name}`);
      console.log(`     Status: ${statusIcon}  |  Signals: ${emitted}/${emitted + pending}`);
      
      if (agent.dependencies?.length > 0 && agent.status === 'waiting') {
        console.log(`     ${colors.gray}Waiting for: ${agent.dependencies.join(', ')}${colors.reset}`);
      }
      console.log();
    }
  }

  // Summary
  const running = Object.values(registry.agents).filter(a => a.status === 'running').length;
  const waiting = Object.values(registry.agents).filter(a => a.status === 'waiting').length;
  const complete = Object.values(registry.agents).filter(a => a.status === 'complete').length;
  const deferred = Object.values(registry.agents).filter(a => a.status === 'deferred').length;

  console.log(`${colors.cyan}───────────────────────────────────────────────────────────────${colors.reset}`);
  console.log(`  ${colors.green}Running: ${running}${colors.reset}  |  ${colors.yellow}Waiting: ${waiting}${colors.reset}  |  ${colors.green}Complete: ${complete}${colors.reset}  |  ${colors.gray}Deferred: ${deferred}${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);
}

function showSignals() {
  const registry = loadRegistry();
  
  console.log(`\n${colors.bright}${colors.cyan}📡 SIGNAL LOG${colors.reset}\n`);
  
  for (const log of registry.signal_log) {
    const time = new Date(log.timestamp).toLocaleString();
    console.log(`  ${colors.gray}${time}${colors.reset}`);
    console.log(`  ${colors.bright}[${log.agent.toUpperCase()}]${colors.reset} ${log.type}`);
    console.log(`  ${log.message}\n`);
  }
}

function showReady() {
  const registry = loadRegistry();
  
  console.log(`\n${colors.bright}${colors.cyan}🚦 AGENTS READY TO LAUNCH${colors.reset}\n`);
  
  // Get emitted signals
  const emittedSignals = new Set();
  for (const [id, agent] of Object.entries(registry.agents)) {
    for (const signal of agent.signals.emitted || []) {
      emittedSignals.add(`${id}:${signal}`);
    }
  }
  
  // Check which waiting agents have all dependencies met
  const readyAgents = [];
  const blockedAgents = [];
  
  for (const [id, agent] of Object.entries(registry.agents)) {
    if (agent.status !== 'waiting') continue;
    
    const listening = agent.signals.listening || [];
    const unmet = listening.filter(sig => !emittedSignals.has(sig));
    
    if (unmet.length === 0) {
      readyAgents.push({ id, agent });
    } else {
      blockedAgents.push({ id, agent, unmet });
    }
  }
  
  if (readyAgents.length > 0) {
    console.log(`${colors.green}✅ Ready to launch:${colors.reset}`);
    for (const { id, agent } of readyAgents) {
      console.log(`   ${colors.bright}${id.toUpperCase()}${colors.reset}: ${agent.name}`);
    }
    console.log();
  }
  
  if (blockedAgents.length > 0) {
    console.log(`${colors.yellow}⏳ Blocked (waiting for signals):${colors.reset}`);
    for (const { id, agent, unmet } of blockedAgents) {
      console.log(`   ${colors.bright}${id.toUpperCase()}${colors.reset}: ${agent.name}`);
      console.log(`   ${colors.gray}   Needs: ${unmet.join(', ')}${colors.reset}`);
    }
    console.log();
  }
}

function emitSignal(agentId, signal) {
  const registry = loadRegistry();
  const agent = registry.agents[agentId.toLowerCase()];
  
  if (!agent) {
    console.error(`${colors.red}Error: Agent ${agentId} not found${colors.reset}`);
    return;
  }
  
  // Move signal from pending to emitted
  const pendingIndex = agent.signals.pending.indexOf(signal);
  if (pendingIndex === -1) {
    console.error(`${colors.red}Error: Signal ${signal} not in pending list${colors.reset}`);
    console.log(`${colors.gray}Available signals: ${agent.signals.pending.join(', ')}${colors.reset}`);
    return;
  }
  
  agent.signals.pending.splice(pendingIndex, 1);
  agent.signals.emitted = agent.signals.emitted || [];
  agent.signals.emitted.push(signal);
  
  // Log the signal
  registry.signal_log.push({
    timestamp: new Date().toISOString(),
    agent: agentId.toLowerCase(),
    type: signal,
    message: `Signal emitted: [${agentId.toUpperCase()}]:${signal}`
  });
  
  // Check if all signals emitted (COMPLETE)
  if (signal.startsWith('COMPLETE:')) {
    agent.status = 'complete';
  }
  
  saveRegistry(registry);
  
  console.log(`${colors.green}✅ Signal emitted: [${agentId.toUpperCase()}]:${signal}${colors.reset}`);
  
  // Show which agents are now unblocked
  showReady();
}

function showLaunchInstructions(phase) {
  const registry = loadRegistry();
  
  console.log(`\n${colors.bright}${colors.cyan}🚀 LAUNCH INSTRUCTIONS - PHASE ${phase}${colors.reset}\n`);
  
  const phaseData = registry.phases[`phase-${phase}`];
  if (!phaseData) {
    console.error(`${colors.red}Error: Phase ${phase} not found${colors.reset}`);
    return;
  }
  
  console.log(`${colors.bright}Phase: ${phaseData.name}${colors.reset}`);
  console.log(`Agents: ${phaseData.agents.join(', ')}`);
  console.log(`Parallel: ${phaseData.parallel ? 'Yes' : 'No'}`);
  
  if (phaseData.depends_on) {
    console.log(`${colors.yellow}Depends on: ${phaseData.depends_on}${colors.reset}`);
  }
  
  console.log(`\n${colors.bright}Launch Commands:${colors.reset}`);
  for (const agentId of phaseData.agents) {
    const agent = registry.agents[agentId];
    console.log(`\n  ${colors.cyan}# ${agentId.toUpperCase()}: ${agent.name}${colors.reset}`);
    console.log(`  # Priority: ${agent.priority}`);
    console.log(`  # Estimated: ${agent.estimated_days} days`);
    if (agent.dependencies?.length > 0) {
      console.log(`  # Wait for: ${agent.dependencies.join(', ')}`);
    }
  }
  console.log();
}

// Main CLI handler
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'status':
    showStatus();
    break;
  case 'signals':
    showSignals();
    break;
  case 'ready':
    showReady();
    break;
  case 'emit':
    if (args.length < 3) {
      console.error('Usage: node coordinator.js emit <agent-id> <signal>');
      console.error('Example: node coordinator.js emit agent-07 READY:schema-users');
      process.exit(1);
    }
    emitSignal(args[1], args[2]);
    break;
  case 'launch':
    if (args.length < 2) {
      console.error('Usage: node coordinator.js launch <phase>');
      process.exit(1);
    }
    showLaunchInstructions(args[1]);
    break;
  default:
    console.log(`
${colors.bright}Ultra Plan Agent Coordinator${colors.reset}

Usage:
  node coordinator.js status          Show all agent statuses
  node coordinator.js signals         Show signal log
  node coordinator.js ready           Show which agents are ready to launch
  node coordinator.js emit <agent> <signal>  Emit a signal
  node coordinator.js launch <phase>  Show launch instructions for phase

Examples:
  node coordinator.js status
  node coordinator.js emit agent-07 READY:schema-users
  node coordinator.js launch 2
`);
}
