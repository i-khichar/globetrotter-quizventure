
import { defineConfig } from 'vite';

// This is a minimal configuration that redirects to the frontend config
export default defineConfig({
  // This will cause Vite to use the frontend configuration
  configFile: './frontend/vite.config.ts',
});
