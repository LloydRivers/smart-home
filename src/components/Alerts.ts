import { Observable } from "../base/Observable";
class FireAlert {
  public fire(): void {
    console.log("Firing alert");
  }
}
class BurglaryAlert {}

export class Alerts extends Observable {
  fire = new FireAlert();
  burglary = new BurglaryAlert();
}
