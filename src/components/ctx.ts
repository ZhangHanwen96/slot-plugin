import {createContext} from 'react';
import Pubsub from '../utils/store';

interface PluginContext {
    pubsub: Pubsub;
    getConfig: (name: string) => string;
}

const pluginCtx =createContext<PluginContext>({} as PluginContext);

export { pluginCtx };