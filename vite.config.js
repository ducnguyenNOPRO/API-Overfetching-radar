import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/interceptor.ts',
      name: 'ApiOverfetchInspector',
      fileName: 'api-overfetch-inspector'
    }
  }
});
