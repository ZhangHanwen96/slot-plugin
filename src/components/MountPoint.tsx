import { FC, useEffect, useRef } from "react";

interface MountPointProps {
    render: (root: HTMLElement | ShadowRoot) => void;
}

const MountPoint: FC<MountPointProps> = ({ render }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (render && containerRef.current) {
            render(containerRef.current);
        }
    });
  
    return <div ref={containerRef} />;
  }

export default MountPoint