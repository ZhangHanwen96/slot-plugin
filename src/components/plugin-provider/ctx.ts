import { createContext } from "react";
import Pubsub from "@/utils/store";
import { PluginConfig } from "@/interface";

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
    configStore: Pubsub & { addRouter: (config: RouterConfig) => void } & {
        getConfig: (name: string) => PluginConfig | undefined;
    };
    routerConfig: Record<string, RouterConfig>;
}

const pluginCtx = createContext<PluginContext>({} as PluginContext);

export { pluginCtx };
