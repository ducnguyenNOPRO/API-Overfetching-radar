import wrapWithProxy from './wrapWithProxy';
import getAllPaths from './getAllPaths';
import { usedPaths } from './usageRegistry';
import PATTERNS_MAP from './patterns';

type PathSets = {
  allPaths: Set<string>;
  usedPaths?: Set<string>;
}

const result: Map<string, PathSets> = new Map();
const originalFetch = window.fetch;  // Default to use fetch API


// normalize endpoints with query parameters and dynamic paths
function normalizeEndpoints(input: RequestInfo | URL): string {
  let string = input.toString();

  // query parameter
  if (string.indexOf("?") !== -1) {
    return string.substring(0, string.indexOf("?"));
  }

  // dynamic paths using patterns-based
  const segments: string[] = string.split("/").filter(Boolean)
  const normalized = segments.map(segment => {
    for (const [type, pattern] of PATTERNS_MAP) {
      if (pattern.test(segment)) {
        return ":" + type;
      }
    }
    return segment;
  });

  return normalized.join("/");
}

// Overide the gloal fetch function
window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await originalFetch(input, init);
  const endpoint = normalizeEndpoints(input);

  if (!response.ok && response.status === 404) {
      // 404 error handling
      return Promise.reject(response);
  }

  // intercepting
  const clone = response.clone();
  const data = await clone.json();

  // Wrap data with Proxy
  const wrappedData = wrapWithProxy(endpoint, data);
  const allPaths = getAllPaths(data);

  result.set(endpoint, {
    allPaths: allPaths,
  })

  // Replace the json method to return the proxied version
  response.json = () => Promise.resolve(wrappedData);

  return response;
};

// Expose debug API globally
(window as any).__OVERFETCH_REPORT__ = () => {

  usedPaths.forEach((usedPathsSet, key) => {
    const existing = result.get(key);
    if (existing) {
      result.set(key, {
        ...existing,
        usedPaths: usedPathsSet 
      })
    }
  }) 

  console.group('API Overfetch Report');
  console.log("Result:", result);
  console.groupEnd();
};
