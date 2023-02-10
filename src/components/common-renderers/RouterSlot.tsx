import React, { FC, useContext, Suspense, useRef, useEffect } from "react";
import { Link, Route } from "react-router-dom";
import { IframeRender } from "@/components/base-renderers/IframeRenderer";
import RenderSlot from "@/components/base-renderers/ComponentRenderer";
import { pluginCtx } from "@/components/plugin-provider/ctx";
import MountPoint from "../MountPoint";

const RouterSlotLink: FC<any> = () => {
    const { routerConfig } = useContext(pluginCtx);
    const configs = Object.values(routerConfig);
    return (
        <>
            {configs.map(({ linkName, to }) => (
                <li key={to}>
                    <Link to={to}>{linkName}</Link>
                </li>
            ))}
        </>
    );
};

// const LazyComponents = {} as Record<string, any>;

const HTML_RE = /\.html/;

export const RouterSlot: FC<any> & { Link: typeof RouterSlotLink } = () => {
    const { routerConfig } = useContext(pluginCtx);

    const configs = Object.values(routerConfig);

    return (
        <Suspense fallback={<div> ..... loading .....</div>}>
            {/* @ts-ignore */}
            {configs.map(({ url, to, render }) => {
                // let LazyComp;
                // if (Component) {
                //     if (LazyComponents[to]) {
                //         LazyComp = LazyComponents[to];
                //     } else {
                //         LazyComp = LazyComponents[to] = React.lazy(Component);
                //     }
                // }
                return (
                        <Route path={to} exact key={to}>
                            {url && HTML_RE.test(url) ? (
                                <IframeRender
                                    style={{
                                        width: "100vw",
                                        height: "70vh",
                                    }}
                                    iframeSrc={url}
                                    name={`slot-router-demo`}
                                />
                            ) : render ? (
                                <MountPoint render={render} name={to} />
                            ) : null}
                        </Route>
                );
            })}
            <Route path="/plugin*">
                <div>No match plugin</div>
            </Route>
        </Suspense>
    );
};

RouterSlot.Link = RouterSlotLink;
