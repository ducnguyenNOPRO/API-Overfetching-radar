export default function getAllPaths(obj: any, basePath: String[] = [], accumulator = new Set<string>()) {
    if (typeof obj !== "object" || obj === null) return accumulator;

    for (const key of Object.keys(obj)) {
        const nextPath = [...basePath, key];
        accumulator.add(nextPath.join("."));
        getAllPaths(obj[key], nextPath, accumulator);
    }
    return accumulator;
}