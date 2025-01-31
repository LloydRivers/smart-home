import { ICommand } from "../interfaces";
import { Bucket } from "../components/Bucket";

export class StoreDataCommand implements ICommand {
  constructor(
    private bucket: Bucket,
    private key: string,
    private data: any,
    private previousData?: any
  ) {}

  async execute(): Promise<void> {
    this.previousData = await this.bucket
      .retrieve(this.key)
      .catch(() => undefined);
    await this.bucket.store(this.key, this.data);
  }

  async undo(): Promise<void> {
    if (this.previousData === undefined) {
      await this.bucket.delete(this.key);
    } else {
      await this.bucket.store(this.key, this.previousData);
    }
  }
}
