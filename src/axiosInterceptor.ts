import wrapWithProxy from './wrapWithProxy';
import getAllPaths from './getAllPaths';
import { usedPaths } from './usageRegistry';

let allPaths: Set<string> | null = null;

function attachInterceptor() {
    const axios = (window as any).axios;

    if (!axios) {
        console.warn('window.axios not found');
        return;
    }

    axios.interceptors.response.use((response: any) => {
    console.log("Axios Intercepting");
    const original = response.data;

    if (typeof original === 'object' && original !== null) {
        allPaths = getAllPaths(original);
        response.data = wrapWithProxy(original);
    }

    return response;
    });
}

attachInterceptor();

// Expose debug API globally
(window as any).__OVERFETCH_REPORT__ = () => {
  if (!allPaths) {
    console.warn('No API responses captured yet');
    return;
  }

  const unused = [...allPaths].filter(p => !usedPaths.has(p));

  console.group('API Overfetch Report');
  console.log('Used paths:', [...usedPaths]);
  console.log('Unused paths:', unused);
  console.groupEnd();
};