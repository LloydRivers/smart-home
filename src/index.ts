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

// Simulate Intruder Detection
hallwayLights.forEach((light) => eventBus.subscribe("INTRUDER_ALERT", light));
doors.forEach((door) => eventBus.subscribe("INTRUDER_ALERT", door));
// Skip sprinklers as they should not react to intruder alert
// sprinklers.forEach((sprinkler) =>
//   eventBus.subscribe("INTRUDER_ALERT", sprinkler)
// );

// subscribe the lambda
eventBus.subscribe("INTRUDER_ALERT", lambda);

// Subscribe the bucket
eventBus.subscribe("INTRUDER_ALERT", bucket);

// Subscribe the cloudWatch
eventBus.subscribe("INTRUDER_ALERT", cloudWatch);

intruderAlert.detectIntruder();
