import type { Logger as LogTapeLogger } from "@logtape/logtape";

import { deepMerge } from "@bundle/utils/utils/deep-equal.ts";
import { getLogger } from "@logtape/logtape";

export const initLogger = getLogger(["@bundle/core", "init"]);
export const buildLogger = getLogger(["@bundle/core", "build"]);
export const generalLogger = getLogger(["@bundle/core", "general"]);
// Add more loggers as needed

/**
 * A logging template prefix function.  It is used to log a message in
 * a {@link LogCallback} function.
 * @param message The message template strings array.
 * @param values The message template values.
 * @returns The rendered message array.
 */
export type LogTemplatePrefix = (
  message: TemplateStringsArray,
  ...values: unknown[]
) => unknown[];

/**
 * A logging callback function.  It is used to defer the computation of a
 * message template until it is actually logged.
 * @param prefix The message template prefix.
 * @returns The rendered message array.
 */
export type LogCallback = (prefix: LogTemplatePrefix) => unknown[];

export type LogLevel = "error" | "warn" | "info" | "debug" | "fatal";

export interface LoggerOptions<L extends string> {
  logger?: L;
  template?: string;
  context?: Record<string, unknown>;
  loggers?: Record<L, LogTapeLogger>; // Custom loggers passed as name-logger pairs
}

export class Logger<L extends string = "general"> {
  #loggers: Record<L | "general", LogTapeLogger>;
  #currentLogger: L | "general";
  #template?: string;
  #context: Record<string, unknown>;

  constructor(options: LoggerOptions<L> = {} as LoggerOptions<L>) {
    const { logger = "general" as L, template, context = {}, loggers = {} } = options;
    this.#loggers = {
      general: generalLogger,
    } as Record<L | "general", LogTapeLogger>;
    this.#template = template;
    this.#context = context;
    this.#currentLogger = logger;

    // Dynamically create getters for custom loggers
    for (const [name, _logger] of Object.entries<LogTapeLogger>(loggers)) {
      this.#loggers[name as L] = _logger;
      this.#createLoggerGetter(name as L);
    }
  }

  #createLoggerGetter(name: L): void {
    Object.defineProperty(this, name, {
      get: () => {
        this.#currentLogger = name;
        return this;
      },
      configurable: true,
      enumerable: true,
    });
  }

  with(options: LoggerOptions<L> = {}): this {
    if (options.logger) {
      this.#currentLogger = options.logger;
      if (!this.#loggers[options.logger]) {
        throw new Error(`Logger "${options.logger}" is not registered.`);
      }
    }
    if (options.template) {
      this.#template = options.template;
    }
    if (options.context) {
      this.#context = deepMerge(this.#context, options.context);
    }
    return this;
  }

  getLogger() { return this.#loggers[this.#currentLogger]; }
  #log(level: LogLevel, template: TemplateStringsArray | string | LogCallback | Record<string, unknown>, ...args: unknown[]): void {
    const logger = this.#loggers[this.#currentLogger];
    let message: TemplateStringsArray | string | LogCallback = "";
    let context = structuredClone(this.#context);
  
    if (typeof template === "string") {
      message = template;

      const possibleArg = typeof args[0] === "function" ? args[0]?.(context) : args[0];
      if (possibleArg) context = deepMerge(context, (possibleArg ?? {}) as Record<string, unknown>);
      logger[level](message, context);
    } else if (typeof template === "object" && !Array.isArray(template)) {
      message = this.#template || "Log message"; // Default message if no template is provided
      context = deepMerge(context, template as Record<string, unknown>);
      
      const possibleArg = typeof args[0] === "function" ? args[0]?.(context) : args[0];
      if (possibleArg) context = deepMerge(context, (possibleArg ?? {}) as Record<string, unknown>);
      logger[level](message, context);
    } else {
      logger[level](template as TemplateStringsArray, ...args);
    }
  }

  error(templateOrContext: TemplateStringsArray | string | LogCallback | Record<string, unknown>, ...args: unknown[]): void {
    this.#log("error", templateOrContext, ...args);
  }

  warn(templateOrContext: TemplateStringsArray | string | LogCallback | Record<string, unknown>, ...args: unknown[]): void {
    this.#log("warn", templateOrContext, ...args);
  }

  info(templateOrContext: TemplateStringsArray | string | LogCallback | Record<string, unknown>, ...args: unknown[]): void {
    this.#log("info", templateOrContext, ...args);
  }

  debug(templateOrContext: TemplateStringsArray | string | LogCallback | Record<string, unknown>, ...args: unknown[]): void {
    this.#log("debug", templateOrContext, ...args);
  }

  fatal(templateOrContext: TemplateStringsArray | string | LogCallback | Record<string, unknown>, ...args: unknown[]): void {
    this.#log("fatal", templateOrContext, ...args);
  }

  value(context: Record<string, unknown>): this {
    this.#context = deepMerge(this.#context, context);
    return this;
  }

  // Shortcut for general logger
  get general(): this {
    this.#currentLogger = "general";
    return this;
  }
}

// Interface to extend Logger with custom loggers
export type LoggerWithCustomLoggers<L extends string> = Logger<L> & {
  [P in L]: Logger<L>;
}

// Function to create a logger with typed custom loggers
export function createLogger<L extends string>(options: LoggerOptions<L> = {}): LoggerWithCustomLoggers<L> {
  return new Logger(options) as LoggerWithCustomLoggers<L>;
}


// Usage examples:

// const logger = createLogger({
//   loggers: {
//     init: initLogger,
//     build: buildLogger,
//     customLogger: getLogger(["@bundle/core", "custom"]),
//   },
// });

// // Logs to the general logger by default
// logger.info`General Log ${5}`;

// // Logs to the init logger with a custom template
// logger.with({ logger: "init", template: "start {time}" }).warn({ time: Date.now() });

// // Logs an error to the init logger
// logger.with({ logger: "init" }).error("error {message}", { message: "Error message" });

// // Shortcut for init logger
// logger.init.error("Initialization failed: {error}", { error: new Error("cool") });

// // Logs to the custom logger
// logger.customLogger.info("Custom logger in action");

// // Shortcut for build logger
// logger.build.fatal`A fatally cool message`;

// // This will now cause a TypeScript error, as 'nonExistentLogger' is not registered
// // logger.nonExistentLogger.info("This should not compile");
