/**
 * Get workflow limit for user
 */
export function getWorkflowLimit(plan: 'free' | 'premium'): number {
    return plan === 'premium' ? Infinity : 3;
}

/**
 * Mock TikTok data fetcher - in production, integrate with TikTok API
 */
export async function fetchTrendingTikToks(username?: string): Promise<any[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data - in production, this would call TikTok API
    const mockData = [
        {
            id: '1',
            username: username || 'example_user',
            views: Math.floor(Math.random() * 1000000) + 100000,
            description: 'Trending video about automation',
            createdAt: new Date().toISOString(),
        },
        {
            id: '2',
            username: username || 'example_user',
            views: Math.floor(Math.random() * 900000) + 50000,
            description: 'How to build SaaS apps',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
    ];

    return mockData;
}

/**
 * Send Discord webhook message
 */
export async function sendDiscordMessage(webhookUrl: string, message: string): Promise<boolean> {
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message }),
        });
        return response.ok;
    } catch (error) {
        console.error('Failed to send Discord message:', error);
        return false;
    }
}

/**
 * Save file to mock Google Drive - in production, use Google Drive API
 */
export async function saveToGoogleDrive(folderId: string, fileName: string, content: string): Promise<boolean> {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // In production, this would upload to Google Drive
        // For now, we'll just log it and return success
        console.log(`[MOCK] Saving ${fileName} to Google Drive folder ${folderId}`);
        console.log(`[MOCK] Content: ${content.substring(0, 200)}...`);

        // You could save to local file system for testing
        // const fs = require('fs');
        // const path = require('path');
        // const filePath = path.join(process.cwd(), 'mock-google-drive', folderId, fileName);
        // fs.mkdirSync(path.dirname(filePath), { recursive: true });
        // fs.writeFileSync(filePath, content);

        return true;
    } catch (error) {
        console.error('Failed to save to Google Drive:', error);
        return false;
    }
}
