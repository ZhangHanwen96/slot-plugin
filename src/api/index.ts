import { PluginConfig } from "@/interface";

const devConfig = {
    // "slot-render-demo": `http://localhost:3000/renderers/renderer.mjs?t=${crypto.randomUUID().slice(0, 5)}`,
    "slot-render-demo": `http://localhost:5173/src/slot-sdk/slots/dam-dev-entry.tsx?t=${crypto
        .randomUUID()
        .slice(0, 5)}`,
    "slot-iframe-demo": "http://localhost:4173/",
    "slot-pure-fn-demo": "http://localhost:5173/pureFn/pureFn.js",
};
const cdnConfig = {
    "slot-render-demo":
        "https://static.tezign.com/slot-plugin-demo/render/index.js",
    "slot-iframe-demo":
        "https://static.tezign.com/slot-plugin-demo/iframe/index.html",
    "slot-pure-fn-demo":
        "https://static.tezign.com/slot-plugin-demo/pureFn/index.js",
    entry: "https://static.tezign.com/slot-plugin-demo/entry/index.js",
};

const config: PluginConfig[] = [
    {
        pluginName: "slot-render-demo",
        config: { url: cdnConfig["slot-render-demo"], pluginType: "component" },
    },
    {
        pluginName: 'slot-iframe-demo',
        config: { url: cdnConfig['slot-iframe-demo'], pluginType: 'iframe' },
    },
    {
        pluginName: 'slot-pure-fn-demo',
        config: { url: cdnConfig['slot-pure-fn-demo'], pluginType: 'function' },
    }, 
    {
        pluginName: 'entry',
        config: { url: cdnConfig['entry'], pluginType: 'function' },
    }
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const fetchPluginConfig = async () => {
    await delay(100);
    return config;
};
