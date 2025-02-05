import { IEvent, IObserver} from "../interfaces";

export abstract class Observer implements IObserver {
  update(event: IEvent): void {}
}