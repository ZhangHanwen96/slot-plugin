import { FC } from "react";
import type { ReactifiedProps } from "./reactify";

export type CustomComponentNames = "portal-card";

export const ReactifiedComponentRegistry: Partial<
    Record<CustomComponentNames, FC<Omit<ReactifiedProps, 'innerRef'> & {ref: any}> | undefined>
> = {};
