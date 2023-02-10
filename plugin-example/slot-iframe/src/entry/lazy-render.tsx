import { createRoot, Root } from "react-dom/client";

const weakMap = new WeakMap<HTMLElement, Root>();
const render = async (container: HTMLElement) => {
    const { default: LazyComp } = await import("./Component");
    if (!weakMap.get(container)) {
        weakMap.set(container, createRoot(container));
    }
    weakMap.get(container)!.render(<LazyComp />);
};

export default render;
