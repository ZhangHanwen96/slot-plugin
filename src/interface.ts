export type PluginType = 'iframe' | 'component' | 'function';

export interface PluginConfig {
    pluginName: string;
    config: {
        url:  string; 
        pluginType: PluginType;
    }; 
};

export interface Resource<T> {
    read(): T;
}

export interface SlotResource {
    module: {
        read(): {
            render?: (root: HTMLElement | ShadowRoot, props: any) => void;
            cssString?: string;
            useShadowDom?: boolean;
            // /**
            //  * @deprecated
            //  */
            // Component?: React.ComponentType;
        };
    };
    url: string;
    uuid?: string;
}
