import { ILogger } from "../interfaces";

export class ConsoleLogger implements ILogger {
  log(
    level: "DEBUG" | "INFO" | "WARNING" | "ERROR",
    message: string,
    data?: any
  ): void {
    const timestamp = new Date().toISOString();
    console.log(`[${level}] ${timestamp} - ${message}`, data || "");
  }
}
