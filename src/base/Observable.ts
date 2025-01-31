import { IEvent, IObservable, IObserver } from "../interfaces";

// Example of single responsibility principle
export abstract class Observable implements IObservable {
  private observers: Set<IObserver> = new Set();

  subscribe(observer: IObserver): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: IObserver): void {
    this.observers.delete(observer);
  }

  notify(event: IEvent): void {
    this.observers.forEach((observer) => observer.update(event));
  }
}
