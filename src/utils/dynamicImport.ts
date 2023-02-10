
/**
 * @description same as native import, used to suppress vite warning or webpack transpile.
 */
export const dynamicImport = (src: string) => {
    return Function('src', `"use strict"; return import(src);`)(src)
}