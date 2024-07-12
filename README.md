# CallsQueue

`CallsQueue` is a TypeScript class designed for efficient background processing of asynchronous tasks in Bun and Node.js applications. It's particularly useful for operations like logging or other I/O-bound tasks that don't require immediate feedback.

## Key Features:

1. **Concurrent Execution**: Utilizes a pool of Bun Workers to process multiple tasks simultaneously.
2. **Configurable Concurrency**: Allows setting the number of concurrent workers (default is 5).
3. **Non-Blocking**: Queues tasks for background processing, allowing the main thread to continue execution.
4. **TypeScript Support**: Fully typed for improved developer experience and code safety.
5. **Error Handling**: Captures and logs errors from worker executions without interrupting the queue.

## Usage:

```typescript
import CallsQueue from '@/queue.ts';

const queue = new CallsQueue(10); // Create a queue with 10 concurrent workers

async function someAsyncTask(data: any): Promise<void> {
  // Your async operation here
}

// Enqueue tasks
queue.enqueue(someAsyncTask, { key: 'value' });

// Tasks are processed automatically in the background
```

**Task example**

```typescript
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
```

## Implementation Notes:

- Uses `Worker` API for true parallel execution.
- Functions are serialized and passed to workers, along with their arguments.
- Requires a separate `worker.ts` file in the same directory as `queue.ts`.

This queue is ideal for scenarios where you must offload numerous asynchronous operations without waiting for their completion, such as logging, non-critical API calls, or batch processing tasks.