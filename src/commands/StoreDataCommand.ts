/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBucket, ICommand, ILogger } from "../interfaces";

export class StoreDataCommand implements ICommand {
  private previousData?: any;

  constructor(
    private readonly bucket: IBucket,
    private readonly logger: ILogger,
    private readonly key: string,
    private readonly data: any
  ) {}

  async execute(): Promise<void> {
    try {
      this.previousData = await this.bucket.retrieve(this.key);
      this.logger.info(`Successfully retrieved data for key "${this.key}"`);
    } catch {
      this.logger.warn(`No previous data found for key "${this.key}"`);
      this.previousData = undefined;
    }

    this.logger.info(
      `Storing new data for key "${this.key}": ${JSON.stringify(this.data)}`
    );

    await this.bucket.store(this.key, this.data);
    this.logger.info(`Data for key "${this.key}" has been stored successfully`);
  }

  async undo(): Promise<void> {
    try {
      if (this.previousData === undefined) {
        this.logger.info(
          `Deleting key "${this.key}" as part of undo operation`
        );
        await this.bucket.delete(this.key);
        this.logger.info(`Key "${this.key}" has been deleted`);
      } else {
        this.logger.info(
          `Restoring previous data for key "${this.key}": ${JSON.stringify(
            this.previousData
          )}`
        );
        await this.bucket.store(this.key, this.previousData);
        this.logger.info(`Previous data restored for key "${this.key}"`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to undo operation for key "${this.key}": ${error}`
      );
    }
  }
}
