import React, { useEffect, useReducer, useRef } from "react";
import {useMemoizedFn} from 'ahooks'
import { usePluginConfig } from "@/components/plugin-provider/PluginProvider";

export function usePureFnSlot<T extends any = void>(name: string): () => Promise<T> {
    const config = usePluginConfig({
        pluginName: name,
        pluginType: 'function'
    });
    const fnRef = useRef<Function>();
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);
    const countRef = useRef(0);

    const memoizedFn = useMemoizedFn(async () => {
        if (fnRef.current) {
            const result = await Promise.resolve(fnRef.current());
            return result;
        }
    })

    useEffect(() => {
        if (!config) return;
        const curCount = ++countRef.current;
        const loadPluginModule = async () => {
            try {
                const { default: _default } = await import(config.url);
                if (curCount !== countRef.current) return;
                if (typeof _default === "function") {
                    fnRef.current = _default;
                    forceUpdate();
                }
            } catch (error) {
                console.log(error)
            }
        };
        loadPluginModule();
    }, [config]);

    return memoizedFn as any;
};
