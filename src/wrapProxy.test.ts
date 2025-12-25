import wrapWithProxy from "./wrapProxy.js";

function deepLog(object: any) {
    if (typeof object !== "object" || object === null) return;
    for (const o in object) {
        deepLog(object[o]);
    }
}

const mockData = {
    user: {
        name: "Alice",
        age: 30,
        address: {
            city: "NY"
        }
    }
};

const proxiedData = wrapWithProxy(mockData);
deepLog(proxiedData);