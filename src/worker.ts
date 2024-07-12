// worker.ts
self.onmessage = async (event: MessageEvent<{ fn: string; args: any[] }>) =>
{
    const {
        fn,
        args
    } = event.data;

    const func = new Function('return ' + fn)() as (...args: any[]) => Promise<void>;

    try
    {
        await func(...args);
        self.postMessage('done');
    }
    catch (error)
    {
        self.postMessage({error: (error as Error).message});
    }
};