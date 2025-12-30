const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiCall = async <T>(data: T, delayMs = 500): Promise<T> => {
  await delay(delayMs);
  return data;
};

export const mockApiError = async (message: string, delayMs = 500): Promise<never> => {
  await delay(delayMs);
  throw new Error(message);
};

export class MockStorage {
  private storage: Map<string, string> = new Map();

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }
}

export const mockStorage = new MockStorage();
