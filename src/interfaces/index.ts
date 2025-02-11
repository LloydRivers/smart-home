export interface IEvent {
  type: string;
  timestamp: Date;
  payload: any;
}

// This allows components to subscribe to events
export interface ISubscriber {
  update(event: IEvent): void;
  getName(): string;
}

// Base interface for all storage operations
export interface IStorageOperations {
  store(key: string, data: any): Promise<void>;
  retrieve(key: string): Promise<any>;
  delete(key: string): Promise<void>;
}

// Base interface for all logging operations
export interface ILogger {
  debug(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, data?: any): void;
}

export interface ISmokeAlarm {
  subscribe(subscriber: ISubscriber): void;
  unsubscribe(subscriber: ISubscriber): void;
}

export interface ICloudwatch {
  update(event: IEvent): void;
  processMetric(event: IEvent): void;
  getMetrics(eventType?: string): IEvent[];
}

export interface IEventBus {
  subscribe(eventType: string, subscriber: ISubscriber): void;
  publish(event: IEvent): void;
}
