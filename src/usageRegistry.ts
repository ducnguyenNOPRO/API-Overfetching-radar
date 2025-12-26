const usedPaths = new Set<string>();

// record all paths from the root of API response
// ex: users.profile.avatarURL
function recordPaths(path: String[]): void{
    usedPaths.add(path.join("."));
}

export { recordPaths, usedPaths };