// No comments explaining the purpose of the interfaces.
// Change the Ievent interface to have any.
export interface IEvent {
  type: any;
  timestamp: any;
  payload: any;
}

export interface IObserver {
  update(event: IEvent): void;
}

export interface IObservable {
  subscribe(observer: IObserver): void;
  unsubscribe(observer: IObserver): void;
  notify(event: IEvent): void;
}

export interface ICommand {
  execute(): Promise<void>;
  undo(): Promise<void>;
}

export interface IStorageOperations {
  store(key: any, data: any): Promise<void>;
  retrieve(key: any): Promise<any>;
  delete(key: any): Promise<void>;
}
