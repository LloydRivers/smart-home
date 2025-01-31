import { Observable } from "../base/Observable";
import { ICommand, IEvent } from "../interfaces";

export class Lambda extends Observable {
  private commandHistory: ICommand[] = [];

  async executeCommand(command: ICommand): Promise<void> {
    try {
      await command.execute();
      this.commandHistory.push(command);

      this.notify({
        type: "COMMAND_EXECUTED",
        timestamp: new Date(),
        payload: { command },
      });
    } catch (error) {
      this.notify({
        type: "COMMAND_FAILED",
        timestamp: new Date(),
        payload: { command, error },
      });
      throw error;
    }
  }

  async undoLastCommand(): Promise<void> {
    const command = this.commandHistory.pop();
    if (command) {
      await command.undo();
      this.notify({
        type: "COMMAND_UNDONE",
        timestamp: new Date(),
        payload: { command },
      });
    }
  }
}
