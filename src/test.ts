import CallsQueue from '@/queue.ts';

const loggingQueue = new CallsQueue(10); // Use 10 concurrent workers

interface LogData
{
    event: string;
    details: Record<string, any>;
}

const logToRemoteServer = async (url: string, authorization: string, data: LogData): Promise<void> =>
{
    // Your actual logging logic here
    console.log('Logged to remote server:', data);

    try
    {
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization
            }

        });
    }
    catch (error)
    {
        console.error('Error logging to remote server:', error);
    }
};

// https://webhook.cool/at/great-ambulance-58
const logUrl = 'https://great-ambulance-58.webhook.cool';

// In your application, whenever you need to log:
loggingQueue.enqueue(logToRemoteServer,
    logUrl,
    'Bearer 123',
    {
        event: 'user_action',
        details: {
            userId: 123,
            action: 'login'
        }
    });

loggingQueue.enqueue(logToRemoteServer,
    logUrl,
    'Bearer 123',
    {
        event: 'system_status',
        details: {
            cpu: '50%',
            memory: '60%'
        }
    });