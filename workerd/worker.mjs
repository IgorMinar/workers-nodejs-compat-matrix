import { visit } from "./dump-utils.mjs";

export default {
    async fetch(request, env, ctx) {
        const result = {};
        for (const name of Object.keys(env.NODE_APIS)) {
            if (name === "*globals*") {
                const nodeGlobals = {};
                for (const globalProp of Object.keys(env.NODE_APIS[name])) {
                    if (globalProp in globalThis) {
                        nodeGlobals[globalProp] = globalThis[globalProp];
                    }
                }
                result[name] = visit(nodeGlobals);
                continue;
            }

            try {
                const module = await import(`node:${name}`);
                result[name] = visit(module);
            } catch {
                continue;
            }
        }
        
        return new Response(JSON.stringify(result, null, 2), {
            headers: { "Content-Type": "application/json" },
        });
    }   
}