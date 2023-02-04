import { useState } from "react";
import RenderSlotDemo from "./demo/RenderSlot";
import RenderIframeDemo from "./demo/RenderIframe";
import PureFnSlotDemo from "./demo/PureFnSlot";
import PluginProvider from "./components/PluginProvider";
import "./App.css";

function App() {
    return (
        <PluginProvider>
            <PureFnSlotDemo />
            <div
                style={{
                    marginBottom: 20,
                }}
            ></div>
            <div className="App">
                <RenderIframeDemo />
                <div
                    style={{
                        padding: 20,
                        border: "3px solid black",
                    }}
                >
                    <RenderSlotDemo />
                </div>
            </div>
        </PluginProvider>
    );
}

export default App;