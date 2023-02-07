import { createContext } from "react";
import Pubsub from "../utils/store";

type IframeType = { url: string };
type ComponentType = {
    Component: () => Promise<{ default: React.ComponentType }>;
};
type RenderType = {
    render: (container: HTMLElement) => void;
};

export type RouterConfig = { linkName: string; to: string } & (
    | IframeType
    | ComponentType
    | RenderType
);

interface PluginContext {
    pubsub: Pubsub;
    getConfig: (name: string) => string;
    routerConfig: Record<string, RouterConfig>;
    addRouter: (config: RouterConfig) => void;
}

const pluginCtx = createContext<PluginContext>({} as PluginContext);

export { pluginCtx };
