/**
 * @description iframe js proxy sandbox
 * // https://github.com/micro-zoe/micro-app/issues/19
 */

export const iframeSandbox = (context: Record<any, any> = {}) => {
    // @ts-ignore
    const iframe = document.createElement("iframe", { url: "about:blank" });
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    const sandboxGlobal = iframe.contentWindow;

    return new Proxy(sandboxGlobal!, {
        get(target, prop) {
            if(prop in context) {
                return Reflect.get(context, prop);
            }
            return Reflect.get(target, prop);
        },
        set(target, prop, value) {
            if(prop in context) {
                return Reflect.set(context, prop, value);
            }
            return Reflect.set(target, prop, value);
        },
    })
};

const runCode = (code: string) => {
    code = `with (sandbox) {${code}}`;
    const fn = new Function("sandbox", code);
};
