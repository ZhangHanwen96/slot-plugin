import React from "react";
import { useMemoizedFn } from "ahooks";
import { usePureFnSlot } from "@/components/base-renderers/usePureFn";

const PureFnSlot = () => {
    const fn = usePureFnSlot("slot-pure-fn-demo");

    const runFn = useMemoizedFn(async () => {
        window.alert("before running fn");
        if (fn) {
           try {
              await fn();
           } catch (error) {
            
           }
        }
        window.alert("after running fn");
    });

    return <button onClick={() => runFn()}>Run pure function</button>;
};

export default PureFnSlot;
