import { ILogger } from "../interfaces";

export class ConsoleLogger implements ILogger {
  debug(message: string, data?: any): void {
    console.debug(`[DEBUG] ${message}`, data || "");
  }

  info(message: string, data?: any): void {
    console.info(`[INFO] ${message}`, data || "");
  }

  warn(message: string, data?: any): void {
    console.warn(`[WARNING] ${message}`, data || "");
  }

  error(message: string, data?: any): void {
    console.error(`[ERROR] ${message}`, data || "");
  }
}
