import { isDevMode } from "./isDevMode";

const cleanUrl = (url: string) => url.replace(/(\?.*|#.*)/, '');

/**
 * @description same as native import, used to suppress vite warning.
 */
const dynamicImport = (src: string) => {
  return Function('src', `"use strict"; return import(src);`)(src)
}

export function fetchRenderSource(url: string) {
    const urlObj = new URL(url);
    // script src, provider 会注入t ?
    const t = urlObj.searchParams.get('t') ?? Date.now().toString();
    // clean url
    const cleanedUrl = cleanUrl(url);

    let modulePromise = dynamicImport(isDevMode() && t ? `${cleanedUrl}?import&uid=${t}` : url)

    return {
        url: cleanedUrl,
        module: wrapPromise(modulePromise),
        /**
         * dev use only
         */
        uuid: t
    }
}

export function wrapPromise<T = any>(promise: Promise<T>) {
    let status = "pending";
    let result: T;
    let suspender = promise.then(
      r => {
        status = "success";
        result = r;
      },
      e => {
        status = "error";
        result = e;
      }
    );
    return {
      read() {
        if (status === "pending") {
          throw suspender;
        } else if (status === "error") {
          throw result;
        } else if (status === "success") {
          return result;
        }
      }
    };
  }