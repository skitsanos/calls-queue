type QueuedFunction = (...args: any[]) => Promise<void>;

interface QueueItem
{
    fn: string;
    args: any[];
}

class CallsQueue
{
    private queue: QueueItem[];
    private processing: boolean;
    private concurrency: number;
    private activeWorkers: number;
    private workerPool: Worker[];

    constructor(concurrency: number = 5)
    {
        this.queue = [];
        this.processing = false;
        this.concurrency = concurrency;
        this.activeWorkers = 0;

        // Create a worker pool
        this.workerPool = Array(concurrency).fill(null).map(() => new Worker(new URL('./worker.ts', import.meta.url)));
    }

    enqueue(fn: QueuedFunction, ...args: any[]): void
    {
        this.queue.push({
            fn: fn.toString(),
            args
        });
        this.processQueue();
    }

    private async processQueue(): Promise<void>
    {
        if (this.processing)
        {
            return;
        }
        this.processing = true;

        while (this.queue.length > 0 && this.activeWorkers < this.concurrency)
        {
            const task = this.queue.shift()!;
            this.activeWorkers++;

            const worker = this.workerPool[this.activeWorkers - 1];
            worker.postMessage(task);

            worker.onmessage = () =>
            {
                this.activeWorkers--;
                this.processQueue();
            };

            worker.onerror = (error: ErrorEvent) =>
            {
                console.error('Error in worker:', error.message);
                this.activeWorkers--;
                this.processQueue();
            };
        }

        this.processing = false;
    }
}

export default CallsQueue;