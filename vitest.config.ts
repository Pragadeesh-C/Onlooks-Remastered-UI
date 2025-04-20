/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'], // Ensure this file exists and has content
    alias: {
      // Correct the alias to point to the 'src' directory (assuming it exists)
      '@': path.resolve(__dirname, './src'),
    },
  },
})