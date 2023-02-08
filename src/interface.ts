export type PluginType = 'iframe' | 'component' | 'function';

export interface PluginConfig {
    pluginName: string;
    config: {
        url:  string; 
        pluginType: PluginType;
    }; 
};
