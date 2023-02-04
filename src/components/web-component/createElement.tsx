import { getStyleTag } from "./utils";

const shadowDomDefaultCss = `:host {box-sizing: border-box; display: block;}`;

export const createElement = ({
    render,
    cssString,
    initialProps,
    useShadowDom = true
}: {
    render: (root: ShadowRoot | HTMLElement, props: any) => void;
    cssString?: string;
    initialProps: any;
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
        }

        connectedCallback() {
            render(this.mountPoint, initialProps);
            console.log("connectedCallback: CustomPortalCard");
        }
    };
};