import { executeScheduledWorkflows } from '../src/lib/workflow-executor';

async function runScheduler() {
    console.log('Running workflow scheduler...');

    try {
        await executeScheduledWorkflows();
        console.log('Scheduled workflows executed successfully');
    } catch (error) {
        console.error('Failed to execute scheduled workflows:', error);
    }
}

// Run once
runScheduler();