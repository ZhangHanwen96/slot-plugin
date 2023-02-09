import React, { useEffect } from "react";
import SlotRenderer from "@/components/base-renderers/ComponentRenderer";
import Suspense from "@/components/Suspense";

const DefaultComponent = () => {
    return (
        <div
            style={{ width: "100%", height: "100%", backgroundColor: "red" }}
        />
    );
};

const slotName = "slot-render-demo";

const RenderSlot = () => {
    const [count, setCount] = React.useState(0);
    
    return (
        <div>
            <button onClick={() => setCount((pre) => pre + 1)}>Inc</button>
            <div
                style={{
                    width: 300,
                    height: 300,
                }}
            >
                <Suspense
                    fallback={<div>loading...</div>}
                    name={slotName}
                >
                    <SlotRenderer
                        // TODO: fix tpyings
                        // @ts-ignore
                        CustomElementName={slotName}
                        $props={{ count, className: "heyheyhey", }}
                        // rest props
                        onClick={() => {
                            console.log("click: hahhah");
                        }}
                        on-custom-event={(e: CustomEvent<{ count: number }>) =>
                            console.log("custom event: ", e.detail.count)
                        }
                    >
                      <DefaultComponent  />
                    </SlotRenderer>
                    
                </Suspense>
            </div>
        </div>
    );
};

export default RenderSlot;
