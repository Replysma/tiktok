import { prisma } from './prisma';
import { createWorkflowLog } from './logs';
import { sendDiscordMessage, saveToGoogleDrive, fetchTrendingTikToks } from './integrations';

/**
 * Execute a workflow by running its trigger and actions
 */
export async function executeWorkflow(workflowId: string, userId: string, triggerData?: any) {
    try {
        // Get workflow with trigger and actions
        const workflow = await prisma.workflow.findUnique({
            where: { id: workflowId },
            include: {
                trigger: true,
                actions: { orderBy: { order: 'asc' } },
            },
        });

        if (!workflow || !workflow.enabled) {
            throw new Error('Workflow not found or disabled');
        }

        // Check if trigger conditions are met
        const triggerResult = await checkTrigger(workflow.trigger, triggerData);
        if (!triggerResult.met) {
            await createWorkflowLog(workflowId, userId, 'error', 'Trigger conditions not met', triggerResult.reason || undefined);
            return;
        }

        // Execute actions in order
        for (const action of workflow.actions) {
            try {
                await executeAction(action, triggerResult.data);
                await createWorkflowLog(workflowId, userId, 'success', `Action executed: ${action.type}`);
            } catch (error) {
                await createWorkflowLog(workflowId, userId, 'error', `Action failed: ${action.type}`, error instanceof Error ? error.message : String(error));
                // Continue with next action or stop? For MVP, continue
            }
        }

        await createWorkflowLog(workflowId, userId, 'success', 'Workflow completed successfully');
    } catch (error) {
        await createWorkflowLog(workflowId, userId, 'error', 'Workflow execution failed', error instanceof Error ? error.message : String(error));
        throw error;
    }
}

/**
 * Check if trigger conditions are met
 */
async function checkTrigger(trigger: any, triggerData?: any) {
    const config = JSON.parse(trigger.config);

    switch (trigger.type) {
        case 'tiktok_post':
            // Check for new TikTok posts
            const tiktoks = await fetchTrendingTikToks(config.username);
            return {
                met: tiktoks.length > 0,
                data: { tiktoks },
                reason: tiktoks.length === 0 ? 'No new TikTok posts found' : null,
            };

        case 'email_received':
            // Mock email trigger - in production, integrate with email service
            return {
                met: triggerData?.emailReceived || false,
                data: triggerData,
                reason: 'Email trigger not activated',
            };

        case 'scheduled':
            // Always met for scheduled triggers
            return {
                met: true,
                data: { scheduled: true },
                reason: null,
            };

        default:
            return {
                met: false,
                data: null,
                reason: 'Unknown trigger type',
            };
    }
}

/**
 * Execute a single action
 */
async function executeAction(action: any, triggerData: any) {
    const config = JSON.parse(action.config);

    switch (action.type) {
        case 'discord_message':
            if (!config.webhookUrl) throw new Error('Discord webhook URL not configured');
            const message = buildMessage(config.messageTemplate, triggerData);
            const success = await sendDiscordMessage(config.webhookUrl, message);
            if (!success) throw new Error('Failed to send Discord message');
            break;

        case 'google_drive_save':
            if (!config.googleDriveFolderId) throw new Error('Google Drive folder ID not configured');
            const fileName = `workflow-data-${Date.now()}.json`;
            const content = JSON.stringify(triggerData, null, 2);
            const saved = await saveToGoogleDrive(config.googleDriveFolderId, fileName, content);
            if (!saved) throw new Error('Failed to save to Google Drive');
            break;

        case 'email_send':
            if (!config.emailTo) throw new Error('Recipient email not configured');
            // Mock email sending - in production, integrate with email service
            console.log(`Sending email to ${config.emailTo} with data:`, triggerData);
            break;

        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}

/**
 * Build message from template and data
 */
function buildMessage(template: string, data: any): string {
    if (!template) {
        return `Workflow triggered with data: ${JSON.stringify(data)}`;
    }

    // Simple template replacement - replace {{key}} with data.key
    let message = template;
    Object.keys(data).forEach(key => {
        message = message.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
    });

    return message;
}

/**
 * Execute all enabled workflows for a user (for scheduled triggers)
 */
export async function executeScheduledWorkflows() {
    try {
        const workflows = await prisma.workflow.findMany({
            where: {
                enabled: true,
                trigger: {
                    type: 'scheduled',
                },
            },
            include: {
                trigger: true,
                user: true,
            },
        });

        for (const workflow of workflows) {
            try {
                await executeWorkflow(workflow.id, workflow.userId);
            } catch (error) {
                console.error(`Failed to execute scheduled workflow ${workflow.id}:`, error);
            }
        }
    } catch (error) {
        console.error('Failed to execute scheduled workflows:', error);
    }
}