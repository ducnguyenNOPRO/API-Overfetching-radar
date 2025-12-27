const usedPaths = new Map<string, Set<string>>();

// record all paths from the root of API response
// ex: users.profile.avatarURL
function recordPaths(endpoint: string, path: string[]): void {
  if (!usedPaths.has(endpoint)) {
    usedPaths.set(endpoint, new Set());
  }
  usedPaths.get(endpoint)!.add(path.join("."));
}


export { recordPaths, usedPaths };