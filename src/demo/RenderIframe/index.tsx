import React from "react";
import IframeSlot from "@/components/IframeSlot";
import Suspense from "@/components/Suspense";
import ErrorThrower from "@/components/ErrorThrower";
import Pubsub from "@/utils/store";

const slotName = "slot-iframe-demo";


const RenderIframe = () => {
    const [count, setCount] = React.useState(0);
    
    const [throwError, setThrowError] = React.useState(false);

    return (
        <div style={{
            width: '100vw',
            height: '40vh'
        }}>
            <button
                onClick={() => {
                    setCount((pre) => pre + 1);
                }}
            >
                INC
            </button>
            <button onClick={() => setThrowError(pre => !pre)}>{throwError ? 'remove' : 'throw'} error</button>
            <Suspense shouldRetry={false} name={slotName} fallback={<div>loading...</div>}>
                <IframeSlot name={slotName} $props={{ count }} />
                {throwError && <ErrorThrower />}
            </Suspense>
            
        </div>
    );
};

export default RenderIframe;
