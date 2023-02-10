// @ts-nocheck
import { isDevMode } from "@/utils/isDevMode";
import Pubsub from "@/utils/store";
import { dynamicImport } from "./dynamicImport";

declare global {
    interface Window {
        _plugin_hmr?: (pluginName: string) => void;
    }
}

export let hmrPubsub: Pubsub;
const setupHMR = () => {
    if (window._plugin_hmr) return;
    hmrPubsub = new Pubsub();
    const update = (pluginName: string) => {
        console.log(pluginName, 'pluginName update')
        hmrPubsub.notify(pluginName, {
            type: "update",
        });
    };
    window._plugin_hmr = update;
};

let shouldInjectReactRefresh = false;
export const importReactRefreshFromLocalDevServer = async (port: number) => { 
    try {
        if(shouldInjectReactRefresh) return true;
        const RefreshRuntime = await dynamicImport(`http://localhost:${port}/@react-refresh`);
        RefreshRuntime.injectIntoGlobalHook(window);
        window.$RefreshReg$ = () => {};
        window.$RefreshSig$ = () => (type) => type;
        window.__vite_plugin_react_preamble_installed__ = true;
        return true;
    } catch (error) {
        // TODO: throw error here in test env
        return false
    } finally {
        shouldInjectReactRefresh = true;
    }
}


if(isDevMode()) {
    setupHMR();
    // importReactRefreshFromLocalDevServer();
}
