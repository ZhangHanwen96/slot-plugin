import { isDevMode } from "@/utils/isDevMode";
import Pubsub from "@/utils/store";

declare global {
    interface Window {
        _plugin_hmr?: (pluginName: string) => void;
        hmrPubsub?: Pubsub;
    }
}

const setupHMR = () => {
    if (window._plugin_hmr) return;
    const hmrPubsub = new Pubsub();
    const update = (pluginName: string) => {
        console.log(pluginName, 'pluginName update')
        hmrPubsub.notify(pluginName, {
            type: "update",
        });
    };
    window._plugin_hmr = update;
    window.hmrPubsub = hmrPubsub
};

if(isDevMode()) {
    setupHMR();
}