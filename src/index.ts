import { EventBus } from "./core/EventBus";
import { SmokeAlarm } from "./alarms/SmokeAlarm";
import { Sprinkler } from "./devices/Sprinkler";
import { Door } from "./devices/Door";
import { Light } from "./devices/Light";
import { IntruderAlarm } from "./alarms/IntruderAlarm";
import { CloudWatch } from "./cloud/CloudWatch";
import { Bucket } from "./cloud/Bucket";
import { Lambda } from "./cloud/Lambda";
import { ConsoleLogger } from "./utils/Logger";

// Create an instance of your logger
const logger = new ConsoleLogger();

// Pass the logger to EventBus
const eventBus = new EventBus(logger);

// Initializing components
const smokeAlarm = new SmokeAlarm(eventBus, logger);
const intruderAlert = new IntruderAlarm(eventBus, logger);
const lambda = new Lambda(logger);
const bucket = new Bucket(logger);
const cloudWatch = new CloudWatch(logger);

const doors = [new Door("Back Door", logger), new Door("Garage Door", logger)];
const hallwayLights = [
  new Light("Hallway", logger),
  new Light("Kitchen", logger),
];
const sprinklers = [
  new Sprinkler("Upstairs", logger),
  new Sprinkler("Downstairs", logger),
];

const intruderAlertListeners = [
  ...hallwayLights,
  ...doors,
  lambda,
  bucket,
  cloudWatch,
];

const alarmAlertListeners = [
  ...hallwayLights,
  ...doors,
  ...sprinklers,
  lambda,
  bucket,
  cloudWatch,
];

intruderAlertListeners.forEach((listener) => {
  eventBus.subscribe("INTRUDER_ALERT", listener);
});

alarmAlertListeners.forEach((listener) => {
  eventBus.subscribe("SMOKE_DETECTED", listener);
});
smokeAlarm.detectSmoke();
intruderAlert.detectIntruder();
