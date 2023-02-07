import React, { FC, useContext, Suspense, useRef, useEffect } from "react";
import { Link, Route } from "react-router-dom";
import { IframeRender } from "./IframeSlot";
import RenderSlot from "./RenderSlot";
import { pluginCtx } from "./ctx";

const RouterSlotLink: FC<any> = () => {
    const { routerConfig } = useContext(pluginCtx);
    const configs = Object.values(routerConfig);
    return (
        <>
            {configs.map(({ linkName, to }) => (
                <li>
                    <Link to={to}>{linkName}</Link>
                </li>
            ))}
        </>
    );
};

const LazyComponents = {} as Record<string, any>;

const MountPoint: FC<{ render: any }> = ({ render }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    console.log(!!render, !!containerRef.current)
      if (render && containerRef.current) {
          render(containerRef.current);
      }
  });

  return <div ref={containerRef} />;
}

const HTML_RE = /\.html/;

export const RouterSlot: FC<any> & { Link: typeof RouterSlotLink } = () => {
    const { routerConfig } = useContext(pluginCtx);

    const configs = Object.values(routerConfig);

    return (
        <>
            {/* @ts-ignore */}
            {configs.map(({ url, to, Component, render }) => {
                let LazyComp;
                if (Component) {
                    if (LazyComponents[to]) {
                        LazyComp = LazyComponents[to];
                    } else {
                        LazyComp = LazyComponents[to] = React.lazy(Component);
                    }
                }
                return (
                    <Route path={to} exact key={to}>
                        {url && HTML_RE.test(url)  ? (
                            <IframeRender
                                style={{
                                    width: "100vw",
                                    height: "70vh",
                                }}
                                iframeSrc={url}
                                name={`slot-router-demo`}
                            />
                        ) : LazyComp ? (
                            // null
                            <LazyComp />
                        ) : (
                            <MountPoint render={render} />
                        )}
                    </Route>
                );
            })}
            <Route path="/plugin*">
                <div>No match plugin</div>
            </Route>
        </>
    );
};

RouterSlot.Link = RouterSlotLink;
