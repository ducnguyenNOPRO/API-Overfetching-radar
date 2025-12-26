import wrapWithProxy from './wrapWithProxy';
import getAllPaths from './getAllPaths';
import { usedPaths } from './usageRegistry';

let allPaths: Set<string> | null = null;
const originalFetch = window.fetch;  // Default to use fetch API

// Overide the gloal fetch function
window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const response = await originalFetch(input, init);
    if (!response.ok && response.status === 404) {
        // 404 error handling
        return Promise.reject(response);
    }

    // intercepting
    const clone = response.clone();
    const data = await clone.json();

    // Wrap data with Proxy
    const wrappedData = wrapWithProxy(data);
    allPaths = getAllPaths(data);

    // Replace the json method to return the proxied version
    response.json = () => Promise.resolve(wrappedData);

    return response;
};

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
