import { ARRAY_PATH } from "./patterns";
import { recordPaths } from "./usageRegistry";

// Wrap the response inside a Proxy
// recursively create a proxy for all properties' access including the root one
function wrapWithProxy<T>(
    endpoint: string,
    target: T,
    path: string[] = [],
): T {
    // no tracking primitive types
    if (typeof target !== 'object' || target === null) {
        return target;
    }

    return new Proxy(target as object, {
        get(obj, property, receiver) {
            const value = Reflect.get(obj, property, receiver);
            if (typeof property === 'string' && property !== "forEach" && property !== "length" && property !== "then") {
                // Normalize path for array indexes
                const regex: RegExp = /^\d+$/;
                let arrayField = property;  // index like 0,1,2, etc.
                if (regex.test(property)) {
                    arrayField = "[]";
                }

                const nextPath = [...path, arrayField];

                
                const joinedPath = nextPath.join(".");
                if (!ARRAY_PATH.test(joinedPath)) {
                    recordPaths(endpoint, nextPath);
                }

                // Recursive wrap a proxy for each nested propety
                return wrapWithProxy(endpoint, value, nextPath);
            }
            return value
        }
    }) as T;
}

export default wrapWithProxy;