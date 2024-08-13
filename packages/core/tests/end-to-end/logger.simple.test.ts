import type { LogRecord, Sink } from '@logtape/logtape';

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { configure, getLogger } from '@logtape/logtape';
import { createLogger } from '../../src/configs/logger.ts'; // Adjust the import path based on your project structure

// Array to hold log records for verification
const logRecords: Array<LogRecord> = [];

// Custom sink that captures log records as strings
const customSink: Sink = (record) => {
  logRecords.push(record);
};

// Configure LogTape with the custom sink
beforeAll(async () => {
  await configure({
    sinks: {
      custom: customSink,
    },
    filters: {},
    loggers: [
      { category: ['@bundle/core', 'init'], level: 'debug', sinks: ['custom'] },
      { category: ['@bundle/core', 'build'], level: 'debug', sinks: ['custom'] },
      { category: ['@bundle/core', 'general'], level: 'debug', sinks: ['custom'] },
      { category: ['@bundle/core', 'custom'], level: 'debug', sinks: ['custom'] },
    ],
  });
});

afterEach(() => {
  // Clear log records after each test to ensure no data leakage between tests
  logRecords.length = 0;
});

describe('Logger Abstraction E2E Tests with Custom Sink', () => {
  const loggers = {
    init: getLogger(['@bundle/core', 'init']),
    build: getLogger(['@bundle/core', 'build']),
    custom: getLogger(['@bundle/core', 'custom']),
  };

  const sampleLogMessage = 'Sample log message';
  const sampleTemplateLogMessage = 'Sample template log message ';
  const sampleValue = 42;

  it('should log to the general logger by default', () => {
    const logger = createLogger({ loggers });
    logger.info`General Log ${5}`;

    // Verify that the log was captured by the custom sink as a string
    expect(logRecords.length).toBe(1);
    expect(logRecords[0].message).toEqual(['General Log ', 5, '']);
  });

  it('should log to a specific custom logger', () => {
    const logger = createLogger({ loggers });
    logger.custom.info`${sampleLogMessage}`;

    // Verify that the custom logger's log was captured by the custom sink as a string
    expect(logRecords.length).toBe(1);
    expect(logRecords[0].message).toEqual(["", sampleLogMessage, ""]);
  });

  it('should log using template literals', () => {
    const logger = createLogger({ loggers });
    logger.init.debug`${sampleTemplateLogMessage}${sampleValue}`;

    // Verify that the log with template literals was captured as a single string
    expect(logRecords.length).toBe(1);
    expect(logRecords[0].message).toEqual(["", sampleTemplateLogMessage, "", sampleValue, ""]);
  });

  it('should log an error message with context data', () => {
    const logger = createLogger({
      loggers,
      context: { userId: '12345', sessionId: 'abcde' },
    });
    logger.build.error`Build failed due to ${'timeout'}`;

    // Verify the error log with context was captured as a string
    expect(logRecords.length).toBe(1);
    expect(logRecords[0].message).toEqual(['Build failed due to ', 'timeout', '']);
  });

  it('should merge context data correctly', () => {
    const logger = createLogger({
      loggers,
      context: { userId: '12345' },
    });
    logger.value({ sessionId: 'abcde' }).info`User session started`;

    // Verify the log with merged context was captured as a string
    expect(logRecords.length).toBe(1);
    expect(logRecords[0].message).toEqual(['User session started']);
  });

  it('should switch between loggers dynamically', () => {
    const logger = createLogger({ loggers });
    logger.init.info`Init log message`;
    logger.build.warn`Build warning message`;

    // Verify both logs were captured as strings
    expect(logRecords.length).toBe(2);
    expect(logRecords[0].message).toEqual(['Init log message']);
    expect(logRecords[1].message).toEqual(['Build warning message']);
  });

  it('should handle fatal log level correctly', () => {
    const logger = createLogger({ loggers });
    logger.general.fatal`Fatal error occurred`;

    // Verify the fatal log was captured as a string
    expect(logRecords.length).toBe(1);
    expect(logRecords[0].message).toEqual(['Fatal error occurred']);
  });
});
