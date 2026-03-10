// tests/setup.ts
// Global test setup — runs before every test file

import { vi } from 'vitest'

// Reset all mocks between tests
afterEach(() => {
  vi.clearAllMocks()
})
