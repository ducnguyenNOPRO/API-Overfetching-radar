import { allPathsAxios } from './axiosInterceptor';
import { allPathsFetch } from './fetchInterceptor';
import { Report, Summary, EndpointReport } from './report';
import { usedPaths } from './usageRegistry';
import detectFetchMethod from './fetchMethodDetect';

let allPaths = new Map<string, Set<string>>();
const method = detectFetchMethod();


if (method === "axios") {
    allPaths = allPathsAxios;
} else if (method === "fetch") {
    allPaths = allPathsFetch;
}

// Expose debug API globally
// Local development only. Use `npm run test` instead
// (window as any).__OVERFETCH_REPORT__ = {
//   getReport: function(): Report {
//     // const report = buildReport();
//     // validateReport(report);
//     // return report;   // Validate in dev mode only
//     return buildReport();
//   },
//   reset: function(): void {
//     return clearReport();
//   }
// };

function buildSummary(endpoints: Record<string, EndpointReport>): Summary {
  let totalFields = 0;
  allPaths.forEach(set => totalFields += set.size);

  let totalUnusedFields = 0;
  Object.values(endpoints).forEach(endpoint => {
    totalUnusedFields += endpoint.unused.length;
  });

  return {
    totalNormalizedEndpoints: Object.keys(endpoints).length,
    totalFields,
    totalUnusedFields,
    overfetchRatio: parseFloat((totalUnusedFields / (totalFields == 0 ? 1: totalFields)).toFixed(3) || "0.000")
  }
}

export function buildReport(): Report {
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

export function clearReport(): void {
  allPaths.clear();
  usedPaths.clear();
}

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


