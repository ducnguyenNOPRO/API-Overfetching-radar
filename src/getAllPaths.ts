import { ARRAY_PATH } from "./patterns";

export default function getAllPaths(
    obj: any,
    basePath: String[] = [],
    accumulator = new Set<string>())
{
    if (typeof obj !== "object" || obj === null) return accumulator;

    for (const key of Object.keys(obj)) {
        // Normalize path for array indexes
        const regex: RegExp = /^\d+$/;
        let arrayField = key;  // index like 0,1,2, etc.
        if (regex.test(key)) {
            arrayField = "[]";
        }

        const nextPath = [...basePath, arrayField];
        const joinedPath = nextPath.join(".");
        
        // Only add path that doens't start or end with []
        if (!ARRAY_PATH.test(joinedPath)) {
            accumulator.add(joinedPath);
        }
        getAllPaths(obj[key], nextPath, accumulator);
    }
    return accumulator;
}