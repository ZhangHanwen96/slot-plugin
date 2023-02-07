import { Suspense, useState } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Prompt,
} from "react-router-dom";
import RenderSlotDemo from "./demo/RenderSlot";
import RenderIframeDemo from "./demo/RenderIframe";
import PureFnSlotDemo from "./demo/PureFnSlot";
import PluginProvider from "./components/PluginProvider";
import { RouterSlot } from "./components/RouterSlot";
import "./App.css";

const Home = () => {
    return (
        <>
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
        </>
    );
};

function App() {
    return (
        <PluginProvider>
            <Router>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <RouterSlot.Link />
                </ul>

                <Suspense fallback={<div>loading......</div>}>
                    <Switch>
                        <Route path="/" exact children={<Home />} />
                        <Route path='/plugin'>
                            <Switch>
                                <RouterSlot />
                            </Switch>
                        
                        </Route>
                    </Switch>
                </Suspense>
            </Router>
        </PluginProvider>
    );
}

export default App;
