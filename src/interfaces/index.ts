export interface IEvent {
  type: string;
  timestamp: Date;
  payload: any;
}

// This allows components to subscribe to events
export interface IObserver {
  update(event: IEvent): void;
}

// This allows components to emit events
export interface IObservable {
  subscribe(observer: IObserver): void;
  unsubscribe(observer: IObserver): void;
  notify(event: IEvent): void;
}

// Commands represent actions that can be executed
export interface ICommand {
  execute(): Promise<void>;
  undo(): Promise<void>;
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

// IEventDispatcher.ts
export interface IEventDispatcher {
  dispatchEvent(event: IEvent): void;
  registerHandler(handler: IEventHandler): void;
}

export interface IEventHandler {
  handleEvent(event: IEvent): void;
}

export interface ISmokeAlarm {
  subscribe(observer: IObserver): void;
  unsubscribe(observer: IObserver): void;
}

export interface ILambda {
  executeCommand(command: ICommand): Promise<void>;
  undoLastCommand(): Promise<void>;
}
export interface ICloudwatch {
  update(event: IEvent): void;
  processMetric(event: IEvent): void;
  getMetrics(eventType?: string): IEvent[];
}
