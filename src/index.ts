import { IntruderAlarm } from "./alarms/IntruderAlarm";
import { SmokeAlarm } from "./alarms/SmokeAlarm";
import { Bucket } from "./cloud/Bucket";
import { CloudWatch } from "./cloud/CloudWatch";
import { Lambda } from "./cloud/Lambda";
import { EventBus } from "./core/EventBus";
import { Door } from "./devices/Door";
import { Light } from "./devices/Light";
import { Sprinkler } from "./devices/Sprinkler";
import { Thermostat } from "./devices/Thermostat";
import { ConsoleLogger } from "./utils/Logger";

// Create an instance of your logger
const logger = new ConsoleLogger();

// Pass the logger to EventBus
const eventBus = new EventBus(logger);

// Initializing components
const smokeAlarm = new SmokeAlarm(eventBus, logger, "HOME_OWNER");
const intruderAlarm = new IntruderAlarm(eventBus, logger, "HOME_OWNER");
const lambda = new Lambda(logger, eventBus);
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
const thermostats = [new Thermostat("New thermostat", logger, 25)];

const intruderAlertListeners = [...hallwayLights, ...doors, lambda, cloudWatch];

const alarmAlertListeners = [
  ...hallwayLights,
  ...doors,
  ...sprinklers,
  lambda,
  cloudWatch,
];

const smartHomeAppListeners = [...thermostats];

intruderAlertListeners.forEach((listener) => {
  eventBus.subscribe("INTRUDER_ALERT", listener);
});

alarmAlertListeners.forEach((listener) => {
  eventBus.subscribe("SMOKE_DETECTED", listener);
});

smartHomeAppListeners.forEach((listener) => {
  eventBus.subscribe("BED_TIME_MODE", listener);
  eventBus.subscribe("COMFORT_MODE", listener);
  eventBus.subscribe("AWAY_MODE", listener);
});
// Subscribe the buckets
eventBus.subscribe("STORE_EVENT_IN_BUCKET", bucket);

smokeAlarm.detectSmoke();
intruderAlarm.detectIntruder();
