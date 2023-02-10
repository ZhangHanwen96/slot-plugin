import { SlotResource } from "@/interface";
import { dynamicImport } from "./dynamicImport";
import { isDevMode } from "./isDevMode";

const cleanUrl = (url: string) => url.replace(/(\?.*|#.*)/, '');

const maxCacheLimit = 100;
let promiseMap: Map<string, SlotResource> | null = null;

export const clearCache = () => {
  promiseMap = null;
}

const setAndGetCache = (importUrl: string) => {
  let modulePromise;
  if(!promiseMap) {
    promiseMap = new Map();
  }
  if(promiseMap.has(importUrl)) {
    modulePromise = promiseMap.get(importUrl);
  } else {
    modulePromise = dynamicImport(importUrl);
    if(maxCacheLimit > promiseMap.size) {
      promiseMap.set(importUrl, modulePromise);
    }
  }
  return modulePromise;
}

export function fetchRenderSource(url: string) {
    const urlObj = new URL(url);
    // script src, provider 会注入t ?
    const t = urlObj.searchParams.get('t') ?? Date.now().toString();

    const cleanedUrl = cleanUrl(url);
    const importUrl = isDevMode() && t ? `${cleanedUrl}?import&uid=${t}` : url;

    const modulePromise = setAndGetCache(importUrl);
  
    return {
        url: cleanedUrl,
        module: wrapPromise(modulePromise),
        /**
         * dev use only, to define different web component for the same slot
         */
        uuid: t
    }
}

export function wrapPromise<T = any>(promise: Promise<T>) {
    let status = "pending";
    let result: T;
    let suspender = promise.then(
      r => {
        console.log('success');
        status = "success";
        result = r;
      },
      e => {
        console.log('error')
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