function visit(root, depth = 0) {
    const entries = Object.entries(root);
    entries.sort(([a], [b]) => a < b ? -1 : 1);
    const visitResult = {};
    for (const [key, value] of entries) {
        const isObject = typeof value === "object" && value !== null && !Array.isArray(value);
        const isDefaultFunction = typeof value === "function" && key === "default" && depth === 0;
        if (isObject || isDefaultFunction) {
            if (depth === 2) return;
            visitResult[key] = visit(value, depth + 1);
        } else {
            visitResult[key] = value === null ? "null" : typeof value;
        }
    }
    return visitResult;
}

export default {
    async fetch(request, env, ctx) {
        const result = {};
        for (const name of Object.keys(env.NODE_APIS)) {
            try {
                const module = await import(`node:${name}`);
                result[name] = visit(module);
            } catch {
                result[name] = null;
                continue;
            }
        }
        
        return new Response(JSON.stringify(result, null, 2), {
            headers: { "Content-Type": "application/json" },
        });
    }   
}