import React, {createRef, createElement, forwardRef, RefObject, FC} from 'react';
import omit from 'lodash/omit';
import { WebComponentProps } from './inteface';
import { composeRef } from '@/utils/mergeRef';


type Constructor<T> = { new (): T };
type ForcedOptions = {
    forcedProperty?: string[];
    forcedAttribute?: string[];
};

export type ReactifiedProps = { $props: any; innerRef: any } & WebComponentProps;

export type ReactifiedComponent = FC<ReactifiedProps>;

export const reactify = <I extends HTMLElement>(
    WC: string,
    { forcedProperty = [], forcedAttribute = [] }: ForcedOptions = {},
    element?: Constructor<I>
) => {
    class Reactified extends React.PureComponent<
        ReactifiedProps
    > {
        $ref: React.RefObject<any>;
        eventHandlers: [string, Function][];
        // @ts-ignore
        innerRef: RefObject<HTMLElement>;

        constructor(props: any) {
            super(props);
            this.eventHandlers = [];
            // const { innerRef } = props;
            // this.innerRef = innerRef;
            this.$ref = createRef<HTMLElement>();
        }

        setProperty(prop: string, value: any) {
            this.$ref.current[prop] = value;
        }

        setAttribute(
            prop: string,
            value: number | string | boolean | null | undefined
        ) {
            if (value === undefined || value === null) {
                return this.$ref.current.removeAttribute(prop);
            }
            this.$ref.current.setAttribute(prop, value.toString());
        }

        setEvent(event: string, handler: Function) {
            this.eventHandlers.push([event, handler]);
            this.$ref.current.addEventListener(event, handler);
        }

        clearEventHandlers() {
            this.eventHandlers.forEach(([event, handler]) => {
                this.$ref.current.removeEventListener(event, handler);
            });
            this.eventHandlers = [];
        }
        componentWillUnmount(): void {
            this.clearEventHandlers();
        }

        update() {
            this.clearEventHandlers();
            const elementProps = omit(this.props, [
                "children",
                "ref",
                "style",
                "className",
                "innerRef",
            ]);
            for (let [k, v] of Object.entries(elementProps)) {
                let forced = false;
                if (forcedProperty.includes(k)) {
                    this.setProperty(k, v);
                    forced = true;
                }
                if (forcedAttribute.includes(k)) {
                    this.setAttribute(k, v);
                    forced = true;
                }
                if (forced) continue;

                if (typeof v === "function") {
                    if (/^on[A-Z]+/.test(k)) {
                        // onCustomEvent
                        this.setEvent(k.toLowerCase().slice(2), v);
                    }
                    // on-custom-event
                    if (/^on-[a-z]+/.test(k)) {
                        this.setEvent(k.toLowerCase().slice(3), v);
                    }
                    continue;
                }
                if (element && k in element.prototype) {
                    this.setProperty(k, v);
                    continue;
                }
                // primitive
                if (
                    ["boolean", "number", "string", "undefined"].includes(
                        typeof v
                    ) ||
                    v === null
                ) {
                    console.log(k, v, "primitive");
                    this.setAttribute(k, v);
                    this.setProperty(k, v);
                    continue;
                }
                this.setProperty(k, v);
            }
        }

        componentDidUpdate() {
            this.update();
        }
        componentDidMount() {
            this.update();
        }

        render() {
            const { children, className, $props, innerRef, style, ...rest } =
                this.props;

            // in case innerRef changes
            if (this.innerRef !== innerRef && innerRef) {
                this.innerRef = innerRef;
                // @ts-ignore
                this._composedRef = composeRef(this.innerRef, this.$ref);
            }

            return React.createElement(
                WC,
                {// @ts-ignore
                    ref: this._composedRef,
                    style,
                    class: className,
                },
                children
            );
        }
    }

    return forwardRef(function ReactifiedWrapper(
        props: { $props: any } & WebComponentProps,
        ref: any
    ) {
        return createElement(Reactified, { ...props, innerRef: ref });
    });
};