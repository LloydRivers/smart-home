import { Observable } from "../base/Observable";
import { IStorageOperations } from "../interfaces";
import { Cloudwatch } from "./Cloudwatch";
import { Lambda } from "./Lambda";

export class Bucket extends Observable implements IStorageOperations {
  // An example of poor variable naming
  private c: Cloudwatch;
  private l: Lambda;
  private s: Map<string, any> = new Map();

  constructor() {
    super();
    // An example of tight coupling; consider injecting dependencies instead of creating instances directly.
    this.c = new Cloudwatch();
    this.l = new Lambda();
  }

  // This function should be private. It's currently accessible outside the class.
  validateData(d: any): void {
    if (d === null || d === undefined) {
      this.c.update({
        type: "ERROR",
        timestamp: new Date(),
        payload: "Data validation failed",
      });
      throw new Error("Invalid d");
    }
  }

  async store(key: string, d: any): Promise<void> {
    this.validateData(d);
    this.s.set(key, d);
    await this.l.executeCommand({
      execute: async () => {
        this.c.update({
          type: "DEBUG",
          timestamp: new Date(),
          payload: "Executing s command",
        });

        await this.processStorageMetrics(key, d);
      },
      undo: async () => {
        this.s.delete(key);
      },
    });
  }

  // Breaks the single responsibility principle by handling both storage and metrics.
  private async processStorageMetrics(key: string, d: any): Promise<void> {
    const sSize = JSON.stringify(d).length;
    this.c.update({
      type: "METRIC",
      timestamp: new Date(),
      payload: {
        sSize,
        totalItems: this.s.size,
      },
    });
  }

  async retrieve(key: string): Promise<any> {
    try {
      const d = this.s.get(key);

      // An example of poor variable naming
      if (!d) {
        this.c.update({
          type: "WARNING",
          timestamp: new Date(),
          payload: `Retrieval failed for key: ${key}`,
        });
        throw new Error(`No d found for key: ${key}`);
      }

      this.c.update({
        type: "INFO",
        timestamp: new Date(),
        payload: `Successfully retrieved d for key: ${key}`,
      });

      return d;
    } catch (error) {
      this.c.update({
        type: "ERROR",
        timestamp: new Date(),
        payload: error,
      });
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    await this.l.executeCommand({
      execute: async () => {
        this.s.delete(key);
        this.c.update({
          type: "INFO",
          timestamp: new Date(),
          payload: `Deleted key: ${key}`,
        });
      },
      // An example of poor variable naming
      undo: async () => {
        this.c.update({
          type: "WARNING",
          timestamp: new Date(),
          payload: `Cannot undo delete for key: ${key}`,
        });
      },
    });
  }
}
