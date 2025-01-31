import { Observable } from "../base/Observable";
import { IStorageOperations, IEvent } from "../interfaces";

export class Bucket extends Observable implements IStorageOperations {
  private storage: Map<string, any> = new Map();

  private validateData(data: any): void {
    if (data === null || data === undefined) {
      throw new Error("Invalid data");
    }
  }

  async store(key: string, data: any): Promise<void> {
    this.validateData(data);
    this.storage.set(key, data);
    this.notify({
      type: "STORAGE_UPDATE",
      timestamp: new Date(),
      payload: { action: "store", key, data },
    });
  }

  async retrieve(key: string): Promise<any> {
    const data = this.storage.get(key);
    if (!data) {
      throw new Error(`No data found for key: ${key}`);
    }
    return data;
  }

  async delete(key: string): Promise<void> {
    this.storage.delete(key);
    this.notify({
      type: "STORAGE_UPDATE",
      timestamp: new Date(),
      payload: { action: "delete", key },
    });
  }
}
