import { Mutex } from 'async-mutex';

export class ThreadSafeQueue<T> {
  private queue: T[];
  private mutex: Mutex;

  constructor() {
    this.queue = [];
    this.mutex = new Mutex();
  }

  async enqueue(item: T): Promise<void> {
    const release = await this.mutex.acquire();
    try {
      this.queue.push(item);
    } finally {
      release();
    }
  }

  async dequeue(): Promise<T | null> {
    const release = await this.mutex.acquire();
    try {
      if (this.queue.length === 0) {
        return null;
      }
      return this.queue.shift() as T;
    } finally {
      release();
    }
  }

  async size(): Promise<number> {
    const release = await this.mutex.acquire();
    try {
      return this.queue.length;
    } finally {
      release();
    }
  }
}
