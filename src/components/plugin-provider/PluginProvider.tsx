import React, {
    FC,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useMemoizedFn, useRequest } from "ahooks";
import { pluginCtx, RouterConfig } from "./ctx";
import Pubsub from "@/utils/store";
import { isDevMode } from "@/utils/isDevMode";
import { fetchPluginConfig } from "@/api";
import { PluginConfig, PluginType } from "@/interface";
import "@/hmr";

let inited = false;
const PluginProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<PluginConfig[]>([]);
    const [pubsub] = useState(() => new Pubsub());
    const [routerConfig, setRouterConfig] = useState<
        Record<string, RouterConfig>
    >({} as any);

    const { data } = useRequest(fetchPluginConfig);

    const getConfig = useMemoizedFn((name: string) =>
        config.find((c) => c.pluginName === name)
    );

    const addRouter = useCallback((config: RouterConfig) => {
        setRouterConfig((prev) => {
            return {
                ...prev,
                [config.linkName]: config,
            };
        });
    }, []);

    const configStore = useMemo(() => {
        return Object.assign(pubsub, {
            addRouter,
            getConfig,
        });
    }, []);

    useEffect(() => {
        if (!data) return;

        // make sure url exists
        const filteredData = data.filter((e) => e.config && e.config.url).map((config) => {
            const {config: {pluginType, url}} = config;
            let fixedPluginType = pluginType;
            if(!pluginType) {
                if(url.endsWith('.html')) {
                    fixedPluginType =  'iframe';
                };
                if(/m?js/.test(url)) {
                    fixedPluginType = 'component'
                };
            }
            // fix possible wrong type
            if(url.endsWith('.html') && pluginType !== 'iframe') {
                fixedPluginType='iframe'
            }
            if(pluginType === 'iframe' && /m?js/.test(url)) {
                fixedPluginType = 'component'
            }
            
            return {
                ...config,
                config: {
                    ...config.config,
                    pluginType: fixedPluginType,
                }
            }
        });


        filteredData.forEach(({ config, pluginName }) => {
            // handle pluginName='entry' differently
            if (pluginName === "entry") {
                const initEntry = async () => {
                    if (inited) return;
                    inited = true;
                    const module = await import(config.url);
                    if (typeof module.default === "function") {
                        module.default({ addRouter });
                    }
                };
                initEntry();
            } else {
                pubsub.notify(pluginName, config);
            }
        });
        setConfig(filteredData as PluginConfig[]);
    }, [data]);

    return (
        <pluginCtx.Provider
            value={{
                configStore,
                routerConfig,
            }}
        >
            {children}
        </pluginCtx.Provider>
    );
};

export const usePluginConfig = ({
    pluginName,
    pluginType,
}: {
    pluginName: string;
    pluginType?: PluginType;
}) => {
    const { configStore } = useContext(pluginCtx);
    const [config, setConfig] = useState<PluginConfig["config"]>();
    const configRef = useRef<PluginConfig["config"]>();
    configRef.current = config;

    useEffect(() => {
        const _config = configStore.getConfig(pluginName);
        const config =
            _config?.config.pluginType === pluginType ? _config : undefined;
        let HmrUnsub = () => {};
        let configUnsub = () => {};
        const enableHmr = (config: PluginConfig["config"]) => {
            if (isDevMode() && window.hmrPubsub) {
                HmrUnsub = window.hmrPubsub.subscribe(pluginName, () => {
                    const cleanUrl = config.url.replace(/\?.*$/, "");
                    const newUrl = cleanUrl + "?t=" + Date.now();
                    setConfig({
                        ...config,
                        url: newUrl,
                    });
                });
            }
        };
        if (config) {
            setConfig(config.config);
            enableHmr(config.config);
        } else {
            configUnsub = configStore.subscribe(
                pluginName,
                (c: PluginConfig["config"]) => {
                    if (c.pluginType === pluginType) {
                        setConfig(c);
                        enableHmr(c);
                    }
                }
            );
        }

        return () => {
            configUnsub();
            HmrUnsub();
        };
    }, [configStore, pluginType]);

    return config;
};

export default PluginProvider;
