import wrapWithProxy from './wrapWithProxy';
import getAllPaths from './getAllPaths';
import normalizeEndpoints from './normalizeEndpoints';

const allPathsFetch = new Map<string, Set<string>>();
let originalFetch: typeof window.fetch | null = null;


// Overide the gloal fetch function
function attachFetchInterceptor() {
  if (originalFetch !== null) return; // already attached

  originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const response = await originalFetch!(input, init);
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
    const paths = getAllPaths(data);

    if (!allPathsFetch.get(endpoint)) {
      allPathsFetch.set(endpoint, paths)
    }
    // Replace the json method to return the proxied version
    response.json = () => Promise.resolve(wrappedData);

    return response;
  };
}

export { allPathsFetch, attachFetchInterceptor };

