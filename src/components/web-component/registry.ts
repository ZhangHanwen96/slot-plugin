import { FC } from "react";
import type { ReactifiedComponent, ReactifiedProps } from "./reactify";

export type CustomComponentNames = "portal-card";

export const ReactifiedComponentRegistry: Partial<
    Record<CustomComponentNames, FC<Omit<ReactifiedProps, 'innerRef'> & {ref: any}> | undefined>
> = {};