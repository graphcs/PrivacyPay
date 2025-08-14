// Test setup file for API tests
import dotenv from 'dotenv'

// Load test environment variables
dotenv.config({ path: '.env.test' })

// Set default environment variables for testing
process.env.NODE_ENV = 'test'
process.env.PORT = '3001'
process.env.LOG_LEVEL = 'error' // Reduce logging during tests

// Mock console methods to reduce test output noise
const originalConsole = console
global.console = {
  ...originalConsole,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: originalConsole.error, // Keep error logs for debugging
}