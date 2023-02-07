import React from "react";
import { createRoot, Root } from 'react-dom/client'
import Comp from './Component';

type IframeType =  { url: string; linkName: string; to: string }
type ComponentType = {
    Component: () => Promise<{ default: React.ComponentType }>;
    linkName: string;
    to: string;
}
type RenderType  = {
    render: (container: HTMLElement) => void;
    linkName: string;
    to: string;
}

export type RouterConfig =
    | IframeType
    | ComponentType
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
    app.addRouter({
        linkName: "我是自定义plugin路由-Component",
        to: "/plugin/router-demo-component",
        Component: async () => import("./Component"),
    });
    const weakMap = new WeakMap<HTMLElement, Root>()
    app.addRouter({
        linkName: "我是自定义plugin路由-render",
        to: "/plugin/router-demo-render",
        render: (container: HTMLElement) => {
            if(!weakMap.get(container)) {
                weakMap.set(container, createRoot(container))
            }
            weakMap.get(container)!.render(<Comp />)
        },
    })
};
