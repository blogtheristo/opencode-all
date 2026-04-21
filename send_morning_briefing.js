import { morningBriefingScheduler } from './src/morning-briefing/scheduler.js';

async function main() {
  try {
    await morningBriefingScheduler.runManually();
    console.log('Morning briefing sent successfully');
  } catch (err) {
    console.error('Error sending morning briefing:', err);
  }
}

main();