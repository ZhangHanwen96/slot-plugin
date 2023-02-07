import React, {
    FC,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { pluginCtx, RouterConfig } from "./ctx";
import Pubsub from "../utils/store";
import { isDevMode } from "../utils/isDevMode";

declare global {
    interface Window {
        _plugin_hmr?: (pluginName: string) => void;
    }
}

let hmrPubsub: Pubsub;
const setupHMR = () => {
    if (window._plugin_hmr || !isDevMode()) return;
    hmrPubsub = new Pubsub();
    const update = (pluginName: string) => {
        console.log(pluginName, 'pluginName update')
        hmrPubsub.notify(pluginName, {
            type: "update",
        });
    };
    window._plugin_hmr = update;
};

setupHMR();



let hasInitialized = false;
const PluginProvider: FC<{children: React.ReactNode}> = ({children}) => {
    const [config, setConfig] = useState<Record<string, string>>({});
    const configRef = useRef(config);
    configRef.current = config;
    const [pubsub] = useState(new Pubsub());

    const getConfig = useCallback((name: string) => {
        return configRef.current[name];
    }, []);

    const [routerConfig, setRouterConfig] = useState<Record<string, RouterConfig>>({} as any);

    const addRouter = useCallback((config: RouterConfig) => {
        setRouterConfig((prev) => {
            return {
                ...prev,
                [config.linkName]: config
            }
        });
    }, [])

    useEffect(() => {
        // // fetch config
        // setConfig({});
        // // notify all plugins
        // return () => {};

        // for demo
        const dev_config = {
            // "slot-render-demo": `http://localhost:3000/renderers/renderer.mjs?t=${crypto.randomUUID().slice(0, 5)}`,
            "slot-render-demo": `http://localhost:5173/src/slot-sdk/slots/dam-dev-entry.tsx?t=${crypto.randomUUID().slice(0, 5)}`,
            "slot-iframe-demo": 'http://localhost:4173/',
            "slot-pure-fn-demo": 'http://localhost:5173/pureFn/pureFn.js',
        }
        const cdn_config = {
            "slot-render-demo": 'https://static.tezign.com/slot-plugin-demo/render/index.js',
            "slot-iframe-demo": 'https://static.tezign.com/slot-plugin-demo/iframe/index.html',
            "slot-pure-fn-demo": 'https://static.tezign.com/slot-plugin-demo/pureFn/index.js',
            'entry': 'https://static.tezign.com/slot-plugin-demo/entry/index.js'
        }
        const c = cdn_config;
        if(c.entry) {
            const init = async () => {
                if(hasInitialized) return;
                hasInitialized = true;
                const module = await import(c.entry);
                if(typeof module.default === 'function') {
                    module.default({addRouter});
                }
            }
            init();
        }
        setConfig(c);
        pubsub.notify('slot-render-demo', c["slot-render-demo"]);
        pubsub.notify('slot-iframe-demo', c["slot-iframe-demo"]);
        pubsub.notify('slot-pure-fn-demo', c["slot-pure-fn-demo"]);
    }, []);

    return (
        <pluginCtx.Provider
            value={{
                pubsub,
                getConfig,
                routerConfig,
                addRouter,
            }}
        >{children}</pluginCtx.Provider>
    );
};

export const usePluginConfig = ({ pluginName }: { pluginName: string }) => {
    const { pubsub, getConfig } = useContext(pluginCtx);
    const [url, setUrl] = useState<string>();
    const urlRef = useRef<string>();
    urlRef.current = url;

    useEffect(() => {
        const url = getConfig(pluginName);
        if(url) {
            setUrl(url);
        };

        const unsub = pubsub.subscribe(pluginName, setUrl);
        let hmrUnsub = () => {};
        if(isDevMode()) {
            hmrUnsub = hmrPubsub.subscribe(pluginName, () => {
                if (urlRef.current) {
                    const cleanUrl = urlRef.current.replace(/\?.*$/, "");
                    setUrl(cleanUrl + "?t=" + Date.now());
                }
            });
        }

        return () => {
            unsub();
            hmrUnsub();
        };
    }, [pubsub]);

    return url;
};

export default PluginProvider;
