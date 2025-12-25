const usedPath = new Set<string>();

// record all paths from the root of API response
// ex: users.profile.avatarURL
function recordPaths(path: String[]): void{
    usedPath.add(path.join("."));
}

// Wrap the response inside a Proxy
// recursively create a proxy for all properties' access including the root one
function wrapWithProxy<T>(
    target: T,
    path: string[] = []
): T {
    // no tracking primitive types
    if (typeof target !== 'object' || target === null) {
        return target;
    }

    return new Proxy(target as object, {
        get(obj, property, receiver) {
            // property is not alwayst type string
            // could be string | symbol
            if (typeof property === 'string') {
                const nextPath = [...path, property];
                recordPaths(nextPath);
                console.log("Next Path:", nextPath.join("."));

                // Recursive wrap a proxy for each nested propety
                const value = Reflect.get(obj, property, receiver);
                return wrapWithProxy(value, nextPath);
            }
            return Reflect.get(obj, property, receiver)
        }
    }) as T;
}

export default wrapWithProxy;


// const proxiedData = wrapWithProxy(mockData);
// proxiedData.user.name;
// proxiedData.user.address.city;