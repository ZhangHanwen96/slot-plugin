import Pubsub from "./store";

class DataCenter extends Pubsub {
    #iframeMap?: Map<string, (data: any) => void>;
    constructor() {
        super();
    }

    notifyIframePlugin(slotName: string, data = {}) {
        if(!this.#iframeMap) {
            return;
        }
        for(const [name, postMessage] of this.#iframeMap) {
            if(name === slotName) {
                postMessage(data);
                // need break ?
            }
        }
    };

    registerIframePlugin(slotName: string, postMessage: (data: any) => void) {
        if(!this.#iframeMap) {
            this.#iframeMap = new Map();
        };
        this.#iframeMap.set(slotName, postMessage);

        return () => {
            this.#iframeMap!.delete(slotName);
        }
    }
};

const dataCenter = new DataCenter();

export default dataCenter;