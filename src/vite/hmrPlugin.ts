import {PluginOption} from 'vite';
import path from 'path'


export function getShortName(file: string, root: string) {
    return file.startsWith(root + "/") ? path.posix.relative(root, file) : file;
  }

const WcHmrPlugin = () => {
    let config: any;
    let serverContext;
    const BARE_IMPORT_RE = /^[\w@][^:]/;

    return {
        name: "vite-wc-hmr-plugin",
        configResolved: function (_config) {
            config = _config;
        },
        configureServer(s) {
            // 保存服务端上下文
            serverContext = s;
        },
        transform: async function (code, id) {
            if (/dev-entry/.test(id)) {
                const ms = new magicString(code);
                const [imports] = parse(code);
                const importedFilePaths = [];

                for (const item of imports) {
                    const modName = code.substring(item.s, item.e);
                    const resolved = await this.resolve(modName, id);

                    if (
                        resolved &&
                        !BARE_IMPORT_RE.test(resolved.id) &&
                        (resolved.id.startsWith(".") ||
                            resolved.id.startsWith("/"))
                    ) {
                        
                        const isSrcFile = resolved.id.includes("src");
                        if (isSrcFile) {
                            const resolvedId = `/${getShortName(resolved.id, config.root)}`;
                            importedFilePaths.push(`'${resolvedId}'`);
                        }
                    }
                }
                console.log(importedFilePaths)
                const hmr = `
                    if(import.meta.hot) {
                    // hmr update web component
                    // // 依赖
                    // import.meta.hot.accept([${importedFilePaths.join(",")}], () => {
                    //     _plugin_hmr && _plugin_hmr('slot-render-demo');
                    // });
                    // 自身
                    import.meta.hot.accept(() => {
                        _plugin_hmr && _plugin_hmr('slot-render-demo');
                    });
                    };
                `;
                return {
                    code: ms.append(hmr).toString(),
                    map: ms.generateMap(),
                };
            }
            return code;
        },
    } as PluginOption;
};
