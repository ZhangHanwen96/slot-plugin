import React from "react";
import { createRoot, Root } from 'react-dom/client'
import Comp from './Component';

type IframeType =  { url: string; linkName: string; to: string }
type RenderType  = {
    render: 
        | ((container: HTMLElement) => void) 
        | (() => Promise<{default: React.ComponentType}>);
    linkName: string;
    to: string;
}

export type RouterConfig =
    | IframeType
    | RenderType;

interface App {
    addRouter: (config: RouterConfig) => void;
    addDashboardTab: () => void;
    history: () => void;
}


export default (app: App) => {
    app.addRouter({
        linkName: "我是自定义plugin路由-iframe",
        to: "/plugin/router-demo-iframe",
        url: "https://static.tezign.com/slot-plugin-demo/iframe/index.html",
    });
    /** dynamic import render */
    app.addRouter({
        linkName: "我是自定义plugin路由-comopnent:lazy",
        to: "/plugin/router-demo-component-lazy",
        render: () => import('./lazy-render')
    });
    /** static import render */
    const weakMap = new WeakMap<HTMLElement, Root>();
    app.addRouter({
        linkName: "我是自定义plugin路由-comopnent",
        to: "/plugin/router-demo-component",
        render: (container: HTMLElement) => {
            if (!weakMap.get(container)) {
                weakMap.set(container, createRoot(container));
            }
            weakMap.get(container)!.render(<Comp />);
        }
    })
};


