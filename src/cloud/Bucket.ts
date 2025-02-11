import {
  IEvent,
  ISubscriber,
  ILogger,
  IStorageOperations,
} from "../interfaces";

export class Bucket implements ISubscriber, IStorageOperations {
  private storage: Map<string, any> = new Map();

  constructor(private logger: ILogger) {}

  getName(): string {
    return "Bucket";
  }

  update(event: IEvent): void {
    this.logger.info(`[${this.getName()}] Storing event data`, event);
    this.store(event.timestamp.toISOString(), event);
  }

  async store(key: string, data: any): Promise<void> {
    try {
      this.storage.set(key, data);
      this.logger.info(`[${this.getName()}] Stored data under key: ${key}`);
    } catch (error) {
      this.logger.error(
        `[${this.getName()}] Error storing data under key: ${key}`,
        error
      );
      throw new Error("Failed to store data");
    }
  }

  async retrieve(key: string): Promise<any> {
    try {
      const data = this.storage.get(key);
      if (data) {
        this.logger.info(`[${this.getName()}] Retrieved data for key: ${key}`);
        return data;
      } else {
        this.logger.warn(`[${this.getName()}] No data found for key: ${key}`);
        return null;
      }
    } catch (error) {
      this.logger.error(
        `[${this.getName()}] Error retrieving data for key: ${key}`,
        error
      );
      throw new Error("Failed to retrieve data");
    }
  }

  async delete(key: string): Promise<void> {
    try {
      if (this.storage.has(key)) {
        this.storage.delete(key);
        this.logger.info(`[${this.getName()}] Deleted data for key: ${key}`);
      } else {
        this.logger.warn(
          `[${this.getName()}] No data found for key: ${key} to delete`
        );
      }
    } catch (error) {
      this.logger.error(
        `[${this.getName()}] Error deleting data for key: ${key}`,
        error
      );
      throw new Error("Failed to delete data");
    }
  }
}
