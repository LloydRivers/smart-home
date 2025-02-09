import { EventBus } from "./core/EventBus";
import { SmokeAlarm } from "./features/SmokeAlarm";
import { Sprinkler } from "./features/Sprinkler";
import { Door } from "./features/Door";
import { Light } from "./features/Light";
import { CloudWatch } from "./features/CloudWatch";
import { Bucket } from "./features/Bucket";
import { Lambda } from "./features/Lambda";
import { ConsoleLogger } from "./utils/Logger";

// Create an instance of your logger
const logger = new ConsoleLogger();

// Pass the logger to EventBus
const eventBus = new EventBus(logger);

// Initializing components
const smokeAlarm = new SmokeAlarm(eventBus, logger);
const lambda = new Lambda(eventBus, logger);
const bucket = new Bucket(eventBus, logger);
const cloudWatch = new CloudWatch(eventBus, logger);

const doors = [
  new Door(eventBus, "Front Door", logger),
  new Door(eventBus, "Back Door", logger),
];
const lights = [
  new Light(eventBus, "Hallway", logger),
  new Light(eventBus, "Kitchen", logger),
];
const sprinklers = [
  new Sprinkler(eventBus, "Upstairs", logger),
  new Sprinkler(eventBus, "Downstairs", logger),
];

// Simulate Smoke Detection
smokeAlarm.detectSmoke();
