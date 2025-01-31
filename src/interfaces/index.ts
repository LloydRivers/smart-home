// raf & mena

// Why have I done this? Well, I am following the AWS CDK official docs. They have a similar structure (I use it in my team).

// I have added comments above each interface. Once read, each comment can be deleted and this will give you a change you can push up to show we are collaborating.

// This represents any event in our system
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

export interface IBucket {
  store(key: string, data: any): Promise<void>;
  retrieve(key: string): Promise<any>;
  delete(key: string): Promise<void>;
}
