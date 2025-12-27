import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/fetchInterceptor.ts',
      name: 'ApiOverfetchInspector',
      fileName: 'api-overfetch-inspector'
    }
  }
});
