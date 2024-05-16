import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { cleanup } from '@testing-library/svelte';

expect.extend(matchers);

afterEach(() => cleanup());

export const server = setupServer();

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test (important for test isolation)
afterEach(() => server.resetHandlers());

//  Close server after all tests
afterAll(() => server.close());
