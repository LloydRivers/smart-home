import { IEvent, IEventHandler } from "../interfaces";

export class EventDispatcher {
  private handlers: IEventHandler[] = [];

  getHandlers(): IEventHandler[] {
    return this.handlers;
  }

  registerHandler(handler: IEventHandler): void {
    this.handlers.push(handler);
  }

  dispatchEvent(event: IEvent): void {
    this.handlers.forEach((handler) => handler.handleEvent(event));
  }
}
