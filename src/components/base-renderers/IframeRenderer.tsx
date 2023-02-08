import React, {
    useEffect,
    CSSProperties,
    useState,
    useCallback,
    FC,
} from "react";
import { useUpdateEffect } from "ahooks";
import dataCenter from "@/utils/dataCenter";
import { usePluginConfig } from "@/components/plugin-provider/PluginProvider";

const noop = () => {};


interface IframeRenderProps {
    name: string;
    iframeSrc: string;
    $props?: any;
    style?: CSSProperties;
}
/**
 * 
 * @description render iframe with given src
 */
export const IframeRender: FC<IframeRenderProps> = ({
    $props,
    style = { height: "100%", width: "100%", border: "none" },
    name,
    iframeSrc
}) => {
    const [iframe, setIframe] = useState<HTMLIFrameElement>();
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    const refCallback = useCallback((node: HTMLIFrameElement) => {
        if (iframeRef.current) return;
        setIframe(node);
        // @ts-ignore
        iframeRef.current = node;
    }, []);

    useEffect(() => {
        if (!iframe) return;
        let unsub = noop;
        let unregister = noop;
        const handler = (
            e: MessageEvent<{
                event: string;
                from: string;
            }>
        ) => {
            if (!e.data || e.data.from !== name) {
                return;
            }
            if (e.data.event === "ready") {
                const postMessage = (data: any) => {
                    iframe.contentWindow?.postMessage(
                        {
                            event: "props",
                            data,
                            to: name,
                        },
                        "*"
                    );
                };
                postMessage($props);
                // subscribe props change
                unregister = dataCenter.registerIframePlugin(name, postMessage);
                unsub = dataCenter.subscribe(name, postMessage);
            }
        };
        window.addEventListener("message", handler);
        return () => {
            window.removeEventListener("message", handler);
            unsub();
            unregister();
        };
    }, [iframeSrc, iframe]);

    useUpdateEffect(() => {
        // notify props change
        dataCenter.notify(name, $props);
    }, [$props]);

    return iframeSrc ? (
        <iframe
            src={iframeSrc}
            frameBorder="0"
            ref={refCallback}
            referrerPolicy="no-referrer"
            name={name}
            style={style}
        />
    ) : null;
};

/**
 * 
 * @description Wrapper around 'IframeRender' to get iframeSrc from plugin config
 */
const IframeSlotRender: FC<Omit<IframeRenderProps, 'iframeSrc'>> = (props) => {
    const config = usePluginConfig({
        pluginName: props.name,
        pluginType: 'iframe',
    });
    
    return config ? <IframeRender iframeSrc={config.url} {...props} /> : null;
};


export default IframeSlotRender;
