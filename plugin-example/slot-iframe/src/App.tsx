import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import reactLogoRaw from "./assets/react.svg?raw";

import "./App.css";
import Pubsub from "./store";

function getImageDataURL(svgXml: string) {
    return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgXml)));
}


const slotName = "slot-iframe-demo";

const iframeEventAdapter = (name: string) => {
  const pubsub = new Pubsub();

  const addEventListener = (event: string, listener: (data: any) => void) => {
      pubsub.subscribe(event, listener)
  }

  const dispatchEvent = (event: string, data?: any) => {
      window.parent?.postMessage({
          event,
          data,
          from: name,
          // to,
      }, '*')
  };

  window.addEventListener('message', (e) => {
      if(!e.data || !e.data.event || !e.data.to) return;
      if(e.data.to === name) {
        console.log(e.data)
          pubsub.notify(e.data.event, e.data.data);
      }
  })

  return {
      addEventListener,
      dispatchEvent,
      removeEventListener: pubsub.unsubscribe.bind(pubsub),
  }
};


const adptor = iframeEventAdapter(slotName);


function App() {
    const [data, setData] = useState({count: 0});
    useEffect(() => {
        // not in preview mode
        // if(!location.search.includes('previewMode')) return;
        const isIframe = window.self !== window.top;

        if (isIframe) {
            adptor.dispatchEvent('ready')
            adptor.addEventListener('props', setData)    
        }

    }, []);

    return (
        <div className="App">
            <div>
                <a href="https://reactjs.org" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
                <a href="https://reactjs.org" target="_blank">
                    <img
                        src={getImageDataURL(reactLogoRaw)}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button  >
                    count is {data.count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </div>
    );
}

export default App;
