import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Resource } from "@/interface";
import { wrapPromise } from "@/utils/suspense";


type NormalRender = (root: HTMLElement | ShadowRoot) => void;
type LazyRender = () => Promise<{
    default: NormalRender;
}>;
interface MountPointProps {
    render: LazyRender | NormalRender;
    /**
     * need to use as key
     */
    name: string;
}

let resourceMap: Map<string, ReturnType<LazyRender>>;

const genResource = (lazyRender: LazyRender, key: string) => {
    let renderFn: ReturnType<LazyRender>;

    if(!resourceMap) {
        resourceMap = new Map();
    }
    if (resourceMap.get(key)) {
        renderFn = resourceMap.get(key)!;
    } else {
        renderFn = lazyRender();
        resourceMap.set(key, renderFn);
    }

    return wrapPromise(renderFn);
};

const dynamicImportRegex = /import\((.*)\)/;

// TODO: refactor this, may be buggy
const isImportFn = (fn: Function) => {
    return (
        fn.constructor.name === "AsyncFunction" ||
        fn.constructor.name === "Promise" || dynamicImportRegex.test(fn.toString())
    );
};

const MountPoint: FC<{render: NormalRender}> = ({render}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (render&& containerRef.current) {
            render(containerRef.current);
        }
    });

    return <div ref={containerRef} />;
}


const MountPointWithResource: FC<MountPointProps> = ({ render, name }) => {
    const [resource, setResource] = useState<Resource<{default: NormalRender}> | null>(null);

    useEffect(() => {
        let resource = isImportFn(render as LazyRender) ? genResource(render as LazyRender, name) : null;
        if(!resource) {
            resource = {
                read() {
                    return {default: render}
                }
            } as Resource<{default: NormalRender}>;
        };
        setResource(resource as Resource<{default: NormalRender}>);
    }, [name, render])

    let renderFn: NormalRender;
    if(resource) {
        const render = resource.read().default;
        renderFn = render
    }
    
    // @ts-ignore
    return <MountPoint render={renderFn} />

};

export default MountPointWithResource;
