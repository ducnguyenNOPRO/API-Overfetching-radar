import wrapWithProxy from './wrapWithProxy';
import getAllPaths from './getAllPaths';
import { usedPaths } from './usageRegistry';
import { PATTERNS_MAP, ARRAY_PATH } from './patterns';
import {Report, Summary, EndpointReport} from './report';

const allPaths = new Map<string, Set<string>>();
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
  const paths = getAllPaths(data);

  if (!allPaths.get(endpoint)) {
    allPaths.set(endpoint, paths)
  }
  // Replace the json method to return the proxied version
  response.json = () => Promise.resolve(wrappedData);

  return response;
};

// function validateReport(report: Report) {
//   Object.values(report.endpoints).forEach((endpoint, key) => {
//     const used = endpoint.used;
//     const unused = endpoint.unused;
//     const total = endpoint.total;
//     const ratio = endpoint.overfetchRatio;

//     if (unused.length + used.length !== total) {
//       return false;
//     }

//     if (used.filter(value => unused.includes(value)).length > 0) {
//       return false;
//     }

//     if (ratio > 1 || ratio < 0) {
//       return false;
//     }

//     return true;
//   });
// }

// Expose debug API globally
(window as any).__OVERFETCH_REPORT__ = {
  getReport: function(): Report {
    // const report = buildReport();
    // validateReport(report);
    // return report;   // Validate in dev mode only
    return buildReport();
  },
  reset: function(): void {
    return clearReport();
  }
};

function buildSummary(endpoints: Record<string, EndpointReport>): Summary {
  let totalFields = 0;
  allPaths.forEach(set => totalFields += set.size);

  let totalUnusedFields = 0;
  Object.values(endpoints).forEach(endpoint => {
    totalUnusedFields += endpoint.unused.length;
  });

  return {
    totalEndpoints: Object.keys(endpoints).length,
    totalFields,
    totalUnusedFields,
    overfetchRatio: parseFloat((totalUnusedFields / totalFields).toFixed(3) || "0.000")
  }
}

function buildReport(): Report {
  const endpoints: Record<string, EndpointReport> = {};

  usedPaths.forEach((set, key) => {
    const exist = allPaths.get(key);
    if (exist) {
      const allPaths = exist ?? new Set<string>();
      const unused = [...allPaths].filter(p => !set.has(p))
      endpoints[key] = {
        used: [...set],
        unused,
        total: allPaths.size,
        overfetchRatio: parseFloat((unused.length / allPaths.size).toFixed(3) || "0.000"),
      }
    }
  });

  return {
    summary: buildSummary(endpoints),
    endpoints
  }
}

function clearReport(): void {
  allPaths.clear();
  usedPaths.clear();
}