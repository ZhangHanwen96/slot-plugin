import React, { FC } from "react";
import { usePluginConfig } from "../plugin-provider/PluginProvider";
import IframeSlotRender  from "../base-renderers/IframeRenderer";
import ComponentSlotRenderer from "../base-renderers/ComponentRenderer";

interface Props {
  pluginName: string;
  $props?: any;
}

/**
 * @description
 */
const SlotRenderer: FC<Props> = ({pluginName, $props}) => {
    const config = usePluginConfig({ pluginName: pluginName });
    if (!config) {
        return null;
    }

    return <>
      <ComponentSlotRenderer CustomElementName={pluginName as any} $props={$props}  />
      <IframeSlotRender name={pluginName} $props={$props}  />
    </>
};

export default SlotRenderer;
