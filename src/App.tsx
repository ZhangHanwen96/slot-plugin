import { Suspense } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";
import RenderSlotDemo from "./demo/RenderSlot";
import MultipleRenderSlotDemo from "./demo/MultipleRenderSlot";
import RenderIframeDemo from "./demo/RenderIframe";
import PureFnSlotDemo from "./demo/PureFnSlot";
import PluginProvider from "./components/plugin-provider/PluginProvider";
import { RouterSlot } from "./components/common-renderers/RouterSlot";
import "./App.css";

const Home = () => {
    return (
        <>
            {/* <PureFnSlotDemo /> */}
            <div
                style={{
                    marginBottom: 20,
                }}
            ></div>
            <div className="App">
                {/* <RenderIframeDemo /> */}
                
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
                    <li>
                        <Link to="/component-slot-demo">component-slot-demo</Link>
                    </li>
                    <li>
                        <Link to="/multiple-component-slot-demo">multiple components</Link>
                    </li>
                    <li>
                        <Link to="/iframe-slot-demo">iframe-slot-demo</Link>
                    </li>
                    <li>
                        <Link to="/function-slot-demo">function-slot-demo</Link>
                    </li>
                 
                    <RouterSlot.Link />
                </ul>

                <Suspense fallback={<div>loading......</div>}>
                    <Switch>
                        <Route path="/" exact children={<Home />} />
                        <Route path="/component-slot-demo" exact children={<RenderSlotDemo />} />
                        <Route path="/multiple-component-slot-demo" exact children={<MultipleRenderSlotDemo />} />
                        <Route path="/iframe-slot-demo" exact children={<RenderIframeDemo />} />
                        <Route path="/function-slot-demo" exact children={<PureFnSlotDemo />} />
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
