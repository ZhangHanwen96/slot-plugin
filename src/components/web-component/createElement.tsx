import React, { useEffect } from 'react';
import ErrorThrower from '../ErrorThrower';
import {createRoot} from 'react-dom/client';
import SandBox, {createSandbox} from "@/utils/sandbox";
import { getStyleTag } from "./utils";

const shadowDomDefaultCss = `:host {box-sizing: border-box; display: block;}`;

// const Test = () => {
//     window.aaaa = 1
//     console.log(window.bbbb, 'bbbb')
    
//     return <>
//         <div>test</div>
//         <ErrorThrower />
//     </>
// }

// const sandbox = createSandbox();
// const weakMap = new WeakMap();

// const testRender = (root: ShadowRoot | HTMLElement, props: any) => {
//     if(!weakMap.has(root)) {
//         weakMap.set(root, createRoot(root));
//     }
//     weakMap.get(root).render(<Test />);
// }



export const createElement = ({
    render,
    cssString,
    initialProps,
    useShadowDom = true
}: {
    render: (root: ShadowRoot | HTMLElement, props: any) => void;
    cssString?: string;
    /**
     * optional
     */
    initialProps?: Record<string | symbol | number, any>;
    useShadowDom?: boolean;
}) => {
    return class CustomPortalCard extends HTMLElement {
        mountPoint: ShadowRoot | HTMLElement = this;
        constructor() {
            super();

            if(useShadowDom) {
                this.mountPoint = this.attachShadow({ mode: "open" });


                if(cssString) {
                    const styleContainer = document.createElement("div");
                    const data_name = useShadowDom ? "wc-style-container-with-shadow" : "wc-style-container-no-shadow";
                    styleContainer.setAttribute("data-name", data_name);
        
                    styleContainer.appendChild(getStyleTag(cssString));
                    if(useShadowDom) {
                        styleContainer.appendChild(getStyleTag(shadowDomDefaultCss));
                    }
                    this.mountPoint.appendChild(styleContainer);
                }
            }
            
        }

        set $props(value: any) {
            this._render(value);
        }

        _render(props: any) {
            render(this.mountPoint, props);
            
            // render inside sandbox
            // const mountPoint = this.mountPoint;
            
            // Function('window', 'self', 'mountPoint', 'props', 'render','with(window){render(mountPoint, props)}').call(sandbox, sandbox, sandbox, mountPoint, props, testRender);
        }

        connectedCallback() {
            if(initialProps) {
                this._render(initialProps);
            }

            console.log("connectedCallback: CustomPortalCard");
        }
    };
};