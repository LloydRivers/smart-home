import { IStorageOperations } from "../interfaces";

export class Bucket implements IStorageOperations {
  private storage: Map<string, any> = new Map();
  public name: string;

  constructor(name: string) {
    this.name = name; // Assigning the name to the bucket
  }

  private validateData(data: any): void {
    if (data === null || data === undefined) {
      throw new Error("Invalid data");
    }
  }

  async store(key: string, data: any): Promise<void> {
    this.validateData(data);
    this.storage.set(key, data);
    console.log(`[${this.name}] Stored data for key: ${key}`);
  }

  async retrieve(key: string): Promise<any> {
    const data = this.storage.get(key);
    if (!data) {
      throw new Error(`[${this.name}] No data found for key: ${key}`);
    }
    return data;
  }

  async delete(key: string): Promise<void> {
    this.storage.delete(key);
    console.log(`[${this.name}] Deleted data for key: ${key}`);
  }
}
