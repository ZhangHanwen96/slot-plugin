import { isDevMode } from "./isDevMode";

const cleanUrl = (url: string) => url.replace(/(\?.*|#.*)/, '');

const dynamicImport = (src: string) => {
  return Function('dynamicImport', `"use strict";return import('${src}')`)()
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export function fetchRenderSource(url: string) {
    const urlObj = new URL(url);
    // script src, provider 会注入t ?
    const t = urlObj.searchParams.get('t') ?? Date.now().toString();
    // clean url
    const cleanedUrl = cleanUrl(url);

    const load = async () => {
        return import(
          // add ?import for vite dev server
          /* @vite-ignore */
          isDevMode() && t ? `${cleanedUrl}?import&uid=${t}` : url
        );
    }
    let scriptPromise = load();

    return {
        url: cleanedUrl,
        module: wrapPromise(scriptPromise),
        uuid: t
    }
}

export function wrapPromise(promise: Promise<any>) {
    let status = "pending";
    let result: any;
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