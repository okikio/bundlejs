import type { Logger as LogTapeLogger } from "@logtape/logtape";

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createLogger } from '../src/configs/logger.ts'; // Adjust the import based on your file structure

describe('Logger Library', () => {
  const mockLogger = {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    fatal: vi.fn(),
  } as unknown as LogTapeLogger;

  const loggers = {
    general: mockLogger,
    init: mockLogger,
    build: mockLogger,
    customLogger: mockLogger,
  };

  afterEach(() => {
    // Reset mock call history
    vi.clearAllMocks();
  });

  describe('Basic Logging Operations', () => {
    it('should log to the general logger by default', () => {
      const logger = createLogger({ loggers });
      logger.info`General Log ${5}`;
      expect(mockLogger.info).toHaveBeenCalledWith(
        ['General Log ', ''],
        5,
      );
    });

    it('should log to a specific custom logger', () => {
      const logger = createLogger({ loggers });
      logger.init.error('Initialization failed');
      expect(mockLogger.error).toHaveBeenCalledWith('Initialization failed', {});
    });

    it('should log to a specific custom logger (using tagged templates)', () => {
      const logger = createLogger({ loggers });
      logger.init.error`Initialization failed: ${'test'}`;
      expect(mockLogger.error).toHaveBeenCalledWith(
        ['Initialization failed: ', ''],
        'test'
      );
    });

    it('should log with various log levels', () => {
      const logger = createLogger({ loggers });
      logger.warn('A warning message');
      logger.debug('Debugging message');
      logger.fatal('A fatal message');
      expect(mockLogger.warn).toHaveBeenCalledWith('A warning message', {});
      expect(mockLogger.debug).toHaveBeenCalledWith('Debugging message', {});
      expect(mockLogger.fatal).toHaveBeenCalledWith('A fatal message', {});
    });

    it('should log with various log levels (using tagged templates)', () => {
      const logger = createLogger({ loggers });
      logger.warn`A warning message: ${'something'}`;
      logger.debug`Debugging message: ${42}`;
      logger.fatal`A fatal message: ${new Error('error')}`;

      expect(mockLogger.warn).toHaveBeenCalledWith(
        ['A warning message: ', ''],
        'something'
      );
      expect(mockLogger.debug).toHaveBeenCalledWith(
        ['Debugging message: ', ''],
        42
      );
      expect(mockLogger.fatal).toHaveBeenCalledWith(
        ['A fatal message: ', ''],
        new Error('error')
      );
    });
  });

  describe('Logger Initialization', () => {
    it('should initialize with default options', () => {
      const logger = createLogger({});
      expect(logger).toBeDefined();
      expect(logger.general).toBeDefined();
    });

    it('should initialize with a custom template', () => {
      const logger = createLogger({ loggers, template: 'Custom Template' });
      logger.info('Logging with custom template');
      expect(mockLogger.info).toHaveBeenCalledWith('Logging with custom template', {});
    });

    it('should initialize with context data', () => {
      const context = { user: 'testUser' };
      const logger = createLogger({ loggers, context });
      logger.info('Logging with context');
      expect(mockLogger.info).toHaveBeenCalledWith('Logging with context', context);
    });

    it('should initialize with multiple custom loggers', () => {
      const logger = createLogger({ loggers });
      expect(logger.init).toBeDefined();
      expect(logger.build).toBeDefined();
      expect(logger.customLogger).toBeDefined();
    });
  });

  describe('Logger Methods', () => {
    it('should modify logger options dynamically using with()', () => {
      const logger = createLogger({ loggers });
      logger.with({ logger: 'build', template: 'Building...' }).info('Starting build');
      expect(mockLogger.info).toHaveBeenCalledWith('Starting build', {});
    });

    it('should add context data using value()', () => {
      const logger = createLogger({ loggers });
      logger.value({ requestId: '12345' }).info('Request received');
      expect(mockLogger.info).toHaveBeenCalledWith('Request received', { requestId: '12345' });
    });

    it('should dynamically create getters for custom loggers', () => {
      const logger = createLogger({ loggers });
      expect(logger.init).toBeDefined();
      expect(logger.build).toBeDefined();
    });

    it('should switch to a custom logger dynamically (using tagged template)', () => {
      const logger = createLogger({ loggers });
      logger.init.info`Initialization log: ${'init'}`;
      expect(mockLogger.info).toHaveBeenCalledWith(
        ['Initialization log: ', ''],
        'init'
      );
    });
  });

  describe('Error Handling', () => {
    it('should throw an error for a non-existent logger', () => {
      const logger = createLogger({ loggers });
      // @ts-expect-error Testing invalid logger option
      expect(() => logger.with({ logger: 'nonExistentLogger' }).info('This should fail')).toThrow('Logger "nonExistentLogger" is not registered.');
    });

    it('should throw an error if the logger option is provided in with() and it does not exist', () => {
      const logger = createLogger({ loggers });
      // @ts-expect-error Testing invalid logger option
      expect(() => logger.with({ logger: 'nonExistentLogger' })).toThrow('Logger "nonExistentLogger" is not registered.');
    });
  });

  describe('Log Message Formatting', () => {
    it('should log a simple string message', () => {
      const logger = createLogger({ loggers });
      logger.info('Simple log message');
      expect(mockLogger.info).toHaveBeenCalledWith('Simple log message', {});
    });

    it('should log a message with template strings and values', () => {
      const logger = createLogger({ loggers });
      logger.info`Template Log ${5}`;
      expect(mockLogger.info).toHaveBeenCalledWith(
        ['Template Log ', ''],
        5
      );
    });

    it('should log a message with a callback function', () => {
      const logger = createLogger({ loggers });
      const callback = (prefix: (msg: TemplateStringsArray, ...vals: unknown[]) => unknown[]) => prefix`Callback Log ${5}`;
      logger.info(callback);
      expect(mockLogger.info).toHaveBeenCalledWith(
        callback
      );
    });

    it('should log a message with a context object', () => {
      const logger = createLogger({ loggers });
      logger.info({ userId: 'abc123' });
      expect(mockLogger.info).toHaveBeenCalledWith('Log message', { userId: 'abc123' });
    });

    it('should merge context data from log call with existing context', () => {
      const logger = createLogger({ loggers, context: { user: 'testUser' } });
      logger.info({ requestId: 'abc123' });
      expect(mockLogger.info).toHaveBeenCalledWith('Log message', { user: 'testUser', requestId: 'abc123' });
    });

    it('should use the provided template for logging', () => {
      const logger = createLogger({ loggers, template: 'Custom Template' });
      logger.info('Template provided');
      expect(mockLogger.info).toHaveBeenCalledWith('Template provided', {});
    });

    it('should log with an empty message', () => {
      const logger = createLogger({ loggers });
      logger.info('');
      expect(mockLogger.info).toHaveBeenCalledWith('', {});
    });

    it('should handle undefined values in the message template', () => {
      const logger = createLogger({ loggers });
      logger.info`Value is ${undefined}`;
      expect(mockLogger.info).toHaveBeenCalledWith(
        ['Value is ', ''],
        undefined
      );
    });

    it('should log with a default message if only context is provided', () => {
      const logger = createLogger({ loggers });
      logger.info({ key: 'value' });
      expect(mockLogger.info).toHaveBeenCalledWith('Log message', { key: 'value' });
    });
  });

  describe('Integration with LogTapeLogger', () => {
    it('should call the correct logger based on the log level', () => {
      const logger = createLogger({ loggers });
      logger.error('Error message');
      logger.warn('Warning message');
      logger.debug('Debug message');
      logger.fatal('Fatal message');
      expect(mockLogger.error).toHaveBeenCalledWith('Error message', {});
      expect(mockLogger.warn).toHaveBeenCalledWith('Warning message', {});
      expect(mockLogger.debug).toHaveBeenCalledWith('Debug message', {});
      expect(mockLogger.fatal).toHaveBeenCalledWith('Fatal message', {});
    });

    it('should ensure log level functions are called with correct message and context', () => {
      const logger = createLogger({ loggers, context: { sessionId: '123' } });
      logger.warn('This is a warning');
      expect(mockLogger.warn).toHaveBeenCalledWith('This is a warning', { sessionId: '123' });
    });

    it('should allow switching between loggers dynamically', () => {
      const logger = createLogger({ loggers });
      logger.init.info('Initializing...');
      logger.build.debug('Building...');
      expect(mockLogger.info).toHaveBeenCalledWith('Initializing...', {});
      expect(mockLogger.debug).toHaveBeenCalledWith('Building...', {});
    });

    it('should call the correct logger getter based on dynamic switching', () => {
      const logger = createLogger({ loggers });
      logger.init.info('Switched to init logger');
      expect(mockLogger.info).toHaveBeenCalledWith('Switched to init logger', {});
      logger.build.warn('Switched to build logger');
      expect(mockLogger.warn).toHaveBeenCalledWith('Switched to build logger', {});
    });

    it('should catch TypeScript errors for incorrect log level usage', () => {
      const logger = createLogger({ loggers });
      expect(() => {
        // @ts-expect-error - Attempt to use a non-existent log level should trigger a TypeScript error
        logger.init.verbose('This should fail');
      }).toThrow('logger.init.verbose is not a function');
    });
  });
});
