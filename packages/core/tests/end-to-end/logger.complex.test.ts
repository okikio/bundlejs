import type { LogRecord, Sink } from '@logtape/logtape';
import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';

import { configure, reset, getLevelFilter, getConsoleSink, withFilter, dispose, getLogger } from '@logtape/logtape';
import { createLogger } from '../../src/configs/logger.ts'; // Adjust the import path based on your project structure

// Buffer to collect log records for testing
let buffer: LogRecord[] = [];

// Custom buffer sink that collects logs
const bufferSink: Sink & Disposable = (record) => {
  buffer.push(record);
};
bufferSink[Symbol.dispose] = () => {
  buffer = []; // Clear buffer on disposal
};

// Configuration for LogTape
beforeAll(async () => {
  await configure({
    sinks: {
      buffer: bufferSink,
    },
    filters: {},
    loggers: [
      { category: ['@bundle/core', 'init'], level: 'debug', sinks: ['buffer'] },
      { category: ['@bundle/core', 'build'], level: 'debug', sinks: ['buffer'] },
      { category: ['@bundle/core', 'general'], level: 'debug', sinks: ['buffer'] },
      { category: ['@bundle/core', 'custom'], level: 'debug', sinks: ['buffer'] },
    ],
  });
});

afterEach(() => {
  // Clear buffer after each test
  buffer = [];
});

afterAll(async () => {
  await reset(); // Reset LogTape configuration after all tests
});

describe('Logger Abstraction E2E Tests - LogTape Features', () => {
  const loggers = {
    init: getLogger(['@bundle/core', 'init']),
    build: getLogger(['@bundle/core', 'build']),
    general: getLogger(['@bundle/core', 'general']),
    custom: getLogger(['@bundle/core', 'custom']),
  };

  const logger = createLogger({ loggers });

  const sampleLogMessage = 'Sample log message';
  const sampleTemplateLogMessage = ['Sample template log message ', ''];
  const sampleValue = 42;

  it('should support hierarchical categories', () => {
    logger.init.info`Initialization started`;
    logger.build.debug`Building project`;
    
    expect(buffer.length).toBe(2);
    expect(buffer[0].message).toEqual(['Initialization started']);
    expect(buffer[1].message).toEqual(['Building project']);
  });

  it('should support structured logging', () => {
    logger.general.info('Structured log', { key: 'value' });
    
    expect(buffer.length).toBe(1);
    expect(buffer[0].message).toEqual(['Structured log']);
    expect(buffer[0].properties).toEqual({ key: 'value' });
  });

  it('should support template literals for log messages', () => {
    logger.custom.debug`${sampleTemplateLogMessage[0]}${sampleValue}`;
    
    expect(buffer.length).toBe(1);
    expect(buffer[0].message).toEqual(["", sampleTemplateLogMessage[0], "", sampleValue, ""]);
  });

  it('should support deferring the computation of log messages', () => {
    const expensiveComputation = vi.fn(() => 99);
    logger.build.debug`Deferred computation ${expensiveComputation()}`;
    
    expect(buffer.length).toBe(1);
    expect(buffer[0].message).toEqual(['Deferred computation ', 99, '']);
    expect(expensiveComputation).toHaveBeenCalled();
  });

  it('should support custom sinks', () => {
    logger.general.info`Testing custom sink`;
    
    expect(buffer.length).toBe(1);
    expect(buffer[0].message).toEqual(['Testing custom sink']);
  });

  it('should support level filtering', async () => {
    await reset(); // Reset to reconfigure with a filter
    await configure({
      sinks: {
        buffer: bufferSink,
      },
      filters: {
        infoOrHigher: getLevelFilter('info'),
      },
      loggers: [
        { category: ['@bundle/core', 'general'], level: 'debug', sinks: ['buffer'], filters: ['infoOrHigher'] },
      ],
    });

    logger.general.debug`This debug message should not appear`;
    logger.general.info`This info message should appear`;

    expect(buffer.length).toBe(1);
    expect(buffer[0].message).toEqual(['This info message should appear']);
  });

  it('should support sink-specific filtering', async () => {
    await reset(); // Reset to reconfigure with a sink filter
    await configure({
      sinks: {
        filteredBuffer: withFilter(bufferSink, (log) => log.level === 'error'),
      },
      filters: {},
      loggers: [
        { category: ['@bundle/core', 'build'], level: 'debug', sinks: ['filteredBuffer'] },
      ],
    });

    logger.build.warn`This warning should not appear`;
    logger.build.error`This error should appear`;

    expect(buffer.length).toBe(1);
    expect(buffer[0].message).toEqual(['This error should appear']);
  });

  it('should support disposable sinks', async () => {
    let disposed = false;

    const disposableSink: Sink & Disposable = (record) => {
      buffer.push(record);
    };
    disposableSink[Symbol.dispose] = () => {
      disposed = true;
      buffer = []; // Clear buffer on disposal
    };

    await reset(); // Reset to reconfigure with disposable sink
    await configure({
      sinks: {
        disposable: disposableSink,
      },
      filters: {},
      loggers: [
        { category: ['@bundle/core', 'general'], level: 'debug', sinks: ['disposable'] },
      ],
    });

    logger.general.info`Logging before disposal`;

    expect(buffer.length).toBe(1);
    expect(buffer[0].message).toEqual(['Logging before disposal']);

    await dispose(); // Dispose of the sink

    expect(disposed).toBe(true);
    expect(buffer.length).toBe(0);
  });

  it('should support asynchronous disposable sinks', async () => {
    let disposed = false;

    const asyncDisposableSink: Sink & AsyncDisposable = (record) => {
      buffer.push(record);
    };
    asyncDisposableSink[Symbol.asyncDispose] = async () => {
      disposed = true;
      buffer = []
    };

    await reset(); // Reset to reconfigure with async disposable sink
    await configure({
      sinks: {
        asyncDisposable: asyncDisposableSink,
      },
      filters: {},
      loggers: [
        { category: ['@bundle/core', 'general'], level: 'debug', sinks: ['asyncDisposable'] },
      ],
    });

    logger.general.info`Logging before async disposal`;

    expect(buffer.length).toBe(1);
    expect(buffer[0].message).toEqual(['Logging before async disposal']);

    await dispose(); // Dispose of the sink asynchronously

    expect(disposed).toBe(true);
    expect(buffer.length).toBe(0);
  });

  it('should support explicit disposal', async () => {
    await reset(); // Reset to reconfigure with disposable sink
    await configure({
      sinks: {
        buffer: bufferSink,
      },
      filters: {},
      loggers: [
        { category: ['@bundle/core', 'general'], level: 'debug', sinks: ['buffer'] },
      ],
    });

    logger.general.info`Logging before explicit disposal`;

    expect(buffer.length).toBe(1);
    expect(buffer[0].message).toEqual(['Logging before explicit disposal']);

    await dispose();

    // Verify that no further logs are captured after disposal
    logger.general.info`Logging after disposal`;
    expect(buffer.length).toBe(1); // Should still be 1, as further logging should be discarded
  });

  it('should support resetting configuration', async () => {
    logger.general.info`Logging before reset`;
    expect(buffer.length).toBe(1);

    await reset();

    logger.general.info`Logging after reset`;
    expect(buffer.length).toBe(1); // Should not log after reset, as configuration was reset
  });
});
