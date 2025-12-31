import wrapWithProxy from './wrapWithProxy';
import getAllPaths from './getAllPaths';
import normalizeEndpoints from './normalizeEndpoints';

let allPathsAxios = new Map<string, Set<string>>();
let interceptorId: number | null = null;
const axios = (window as any).axios;

function attachAxiosInterceptor() {
  if (interceptorId !== null) { return; }

    if (!axios) {
        console.warn('window.axios not found');
        return;
    }

    interceptorId = axios.interceptors.response.use((response: any) => {
      const original = response.data;
      const endpoint = normalizeEndpoints(response.config.url);

    if (typeof original === 'object' && original !== null) {
      const paths = getAllPaths(original);
      allPathsAxios.set(endpoint, paths);
        response.data = wrapWithProxy(endpoint, original);
    }

    return response;
    });
}

function detachAxiosInterceptor() {
  if (interceptorId !== null) {
    axios.interceptors.response.eject(interceptorId);
    interceptorId = null;
  }
}

export { allPathsAxios, attachAxiosInterceptor, detachAxiosInterceptor };