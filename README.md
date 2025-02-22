# Smart Home Project

This repository contains the code for our university project focusing on building a smart home application.

## Module Information

- **Module Name:** COM5042 - SOFTWARE ENGINEERING
- **Team Members:**
  - Lloyd Rivers
  - Mena Bousfield-Milton
  - Rafael Barros Parigi

## Tools Used

| Tool                 | Purpose                                 |
| -------------------- | --------------------------------------- |
| **TypeScript**       | Main programming language               |
| **Vitest**           | Testing framework                       |
| **ESLint**           | Linting tool for code quality           |
| **Prettier**         | Code formatting                         |
| **Husky**            | Git hooks for enforcing code standards  |
| **Lint-staged**      | Running linters on staged files         |
| **Typedoc**          | Documentation generation                |
| **Typedoc-umlclass** | UML class diagrams for documentation    |
| **GitHub Actions**   | CI/CD pipeline for testing and building |

## Coding Style

We follow Object-Oriented Programming (OOP) principles.

## Design Patterns

### Event Bus (Pub/Sub Pattern)

The project utilizes an **Event Bus** that follows the **Publish-Subscribe (Pub/Sub)** pattern to facilitate communication between components. This design pattern allows components to publish events without needing to know which components will receive them, promoting loose coupling and scalability.

```typescript
export class EventBus {
  private subscribers: Map<string, ISubscriber[]> = new Map();
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  subscribe(event: string, subscriber: ISubscriber): void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)?.push(subscriber);
    this.logger.log(`Subscriber added to event: ${event}`);
  }

  publish(event: string, data: unknown): void {
    this.subscribers
      .get(event)
      ?.forEach((subscriber) => subscriber.notify(data));
    this.logger.log(`Event published: ${event}`);
  }
}
```

This implementation enables modular event handling. For example, a thermostat component can publish a temperature change event, which is received by other components like the heating system or notifications service.

### Dependency Injection (DI)

We apply **Dependency Injection (DI)** to decouple components from their dependencies, improving testability and maintainability. By injecting dependencies rather than hardcoding them, the system becomes more flexible and easier to modify.

```typescript
interface ILogger {
  log(message: string): void;
}

class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(message);
  }
}

class Thermostat {
  constructor(private logger: ILogger) {}

  setTemperature(value: number): void {
    this.logger.log(`Temperature set to ${value}°C`);
  }
}

const logger = new ConsoleLogger();
const thermostat = new Thermostat(logger);
thermostat.setTemperature(22);
```

In this example, the `Thermostat` receives an `ILogger` instance via its constructor, making it easy to substitute different logging implementations. This approach aligns with the **Dependency Inversion Principle** from SOLID design principles.

## Scripts

| Script                | Command                 | Description                              |
| --------------------- | ----------------------- | ---------------------------------------- |
| **Development**       | `npx tsx src/index.ts`  | Runs the application in development mode |
| **Test**              | `vitest run`            | Executes all tests                       |
| **Test Watch**        | `vitest`                | Runs tests in watch mode                 |
| **Test Coverage**     | `vitest run --coverage` | Generates test coverage reports          |
| **Build Docs**        | `npx typedoc`           | Builds documentation using TypeDoc       |
| **Prepare Git Hooks** | `husky`                 | Initializes Husky Git hooks              |
| **Lint Staged Files** | `lint-staged`           | Runs linters on staged files             |
| **Lint All Files**    | `eslint .`              | Lints the entire codebase                |
| **Fix Lint Errors**   | `eslint --fix .`        | Fixes linting errors where possible      |

## Git Hooks

- **Pre-commit Hook:** Formats staged files using Prettier, fixes lint errors with ESLint, and builds documentation with TypeDoc.

## Continuous Integration

- **GitHub Actions:** Automates testing and documentation builds on each push and pull request.

## Links

- [Project Repository](#)
- [Documentation](#)
- [GitHub Actions Workflow](#)

---

**Note:** Links will be added once available.
