import React, {
    FC,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {useLocation, matchPath} from 'react-router-dom';
import { useMemoizedFn, useRequest } from "ahooks";
import { pluginCtx, RouterConfig } from "./ctx";
import Pubsub from "@/utils/store";
import { isDevMode } from "@/utils/isDevMode";
import { fetchPluginConfig } from "@/api";
import { PluginConfig, PluginType } from "@/interface";
import "@/hmr";
import { hmrPubsub } from "@/hmr";

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

    // TODO: refactor this
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
            // skip entry
            if(config.pluginName === 'entry') return config;
            
            const {config: {pluginType, url}} = config;
            let fixedPluginType = pluginType;
            let mixed = false;
            // guess plugin type if not provided
            if(!pluginType) {
                if(url.endsWith('.html')) {
                    fixedPluginType =  'iframe';
                };
                // could be both component and function
                if(/m?js/.test(url)) {
                    mixed = true;
                };
            }
            // fix type if doesn't match with file extension
            if(url.endsWith('.html') && pluginType !== 'iframe') {
                fixedPluginType = 'iframe'
            }
            // could be both component and function
            if(pluginType === 'iframe' && /m?js/.test(url)) {
                // fixedPluginType = 'component'
                mixed = true;
            }

            const genConfig = (type: PluginType) => ({
                ...config,
                config: {
                    ...config.config,
                    pluginType: type,
                }
            })
            
            return mixed ? [genConfig('component'), genConfig('function') ]  : genConfig(fixedPluginType)
        }).flat();


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

/**
 * @description to controll whether plugin
 */
// export const useMatchPaths = (pathname: string | string[], exact = true) => {
//     const {pathname: _pathname} = useLocation()
//     const pathnames = Array.isArray(pathname) ? pathname : [pathname];
//     return pathnames.some(path => {
//         return matchPath(_pathname, {path, exact})
//     });
// }


/**
 * @description 在 pluginType=component 且render多个的情况下，建议抽离usePluginConfig到最上层
 */
export const usePluginConfig = ({
    pluginName,
    pluginType,
}: {
    pluginName: string;
    pluginType?: PluginType;
}) => {
    const { configStore } = useContext(pluginCtx);
    const [config, setConfig] = useState<PluginConfig["config"]>();

    useEffect(() => {
        const _config = configStore.getConfig(pluginName);
        const config =
            _config?.config.pluginType === pluginType ? _config : undefined;
        let HmrUnsub = () => {};
        let configUnsub = () => {};
        const enableHmr = (config: PluginConfig["config"]) => {
            if (isDevMode() && hmrPubsub) {
                HmrUnsub = hmrPubsub.subscribe(pluginName, () => {
                    const cleanUrl = config.url.replace(/\?.*$/, "");
                    const newUrl = cleanUrl + "?t=" + Date.now();
                    // will force all slots to update
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
    }, [pluginType]);

    return config;
};



export default PluginProvider;
