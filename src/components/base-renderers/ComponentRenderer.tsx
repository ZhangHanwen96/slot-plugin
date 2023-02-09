import React, { FC, useEffect, useRef, useState } from "react";
import omit from 'lodash/omit'
import { fetchRenderSource } from "@/utils/suspense";

import { usePluginConfig } from "@/components/plugin-provider/PluginProvider";
import { createElement } from "@/components/web-component/createElement";
import { WebComponentProps } from "@/components/web-component/inteface";
import { reactify } from "@/components/web-component/reactify";
import {
    ReactifiedComponentRegistry,
} from "@/components/web-component/registry";
import { errorBoundaryRegistery } from "@/components/ErrorBoundary";
import { isDevMode } from "@/utils/isDevMode";
import ErrorThrower from "../ErrorThrower";
import { SlotResource } from "@/interface";


interface WCSlotRendererProps {
    /**
     * Custom resource wrapper to fetch the slot content and work with suspense
     */
    slotResource?: SlotResource | null;
    children?: React.ReactNode;
    /**
     * The tag name of the custom element
     */
    CustomElementName: string;
    /**
     * Will be passed to the custom element as render props
     */
    $props?: { [key: string]: any };
}

export const WebComponentRenderer: FC<WCSlotRendererProps & WebComponentProps> = ({
    $props,
    slotResource,
    CustomElementName,
    children,
    ...rest
}) => {
    const wcRef = useRef<HTMLElement | null>(null);

    let CustomElementNameWithId: string;
    if (slotResource) {
        const result = slotResource.module.read();
        if (result) {
            const wcUid = slotResource.uuid;
            const cssString = result.cssString;
            let componentRenderer = result.render;
            // const ReactComponent = result.Component;

            CustomElementNameWithId = wcUid && isDevMode()
                ? (`${CustomElementName}-${wcUid}` as string)
                : (CustomElementName as string);

            console.log("CustomElementNameWithId", CustomElementNameWithId);

            if (
                customElements.get(CustomElementNameWithId) === undefined &&
                !ReactifiedComponentRegistry[CustomElementNameWithId]
            ) {
                // @ts-ignore
                // if(ReactComponent) {
                //   componentRenderer = (root, props) => {
                //     render(<ReactComponent {...props} />, root)
                //   }
                // }
                // create and register web component
                if(componentRenderer) {
                    const CustomPortalCard = createElement({
                        render: componentRenderer,
                        cssString,
                        initialProps: $props,
                        useShadowDom: result.useShadowDom,
                    });
                    customElements.define(
                        CustomElementNameWithId,
                        CustomPortalCard
                    );
                    ReactifiedComponentRegistry[CustomElementNameWithId] = reactify(
                        CustomElementNameWithId,
                        { forcedProperty: ["$props"] },
                        CustomPortalCard
                    );
                }
                
            }
        }
    }

    const WebComponent =
    // @ts-ignore
        ReactifiedComponentRegistry[CustomElementNameWithId];
    const hasWebComponent = !!WebComponent;

    console.log(hasWebComponent, "hasWebComponent");
 

    return (
        <>      
            {hasWebComponent ? (
                 <WebComponent
                    $props={omit($props, ["className"])}
                    ref={wcRef}
                    {...rest}
                    className={rest.className ?? $props?.className}
                />
            ) : (
                <>{children}</>
            )}
        </>
    );
};

const ComponentRenderer: FC<Omit<WCSlotRendererProps, 'slotResource'> & WebComponentProps> = (props) => {
    const slotResource = useSlotResource(props.CustomElementName);

    return <WebComponentRenderer {...props} slotResource={slotResource} />
    
};

export function useSlotResource(pluginName: string) {
    const config = usePluginConfig({pluginName, pluginType: 'component'});
    const [resource, setResource] = useState<SlotResource | null>(null);
    useEffect(() => {
        if (!config) return;
        const getRenderer = async () => {
            const moduleResource = fetchRenderSource(
                config.url,
            );
            setResource(moduleResource);
        };
        getRenderer();
    }, [config]);

    return resource;
};


export default ComponentRenderer;
