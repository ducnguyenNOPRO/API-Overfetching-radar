import { PATTERNS_MAP } from "./patterns";
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

export default normalizeEndpoints;