import type { Plugin, ResolvedConfig } from 'vite';
import type { FileContainer, Options, UserOptions } from './types';
import { getClientCode, getFilesFromPath, getImportCode, normalizePath } from './utils';
import { resolve as _resolve } from 'path';

const MODULE_IDS = ['layouts-generated', 'virtual:generated-layouts'];
const MODULE_ID_VIRTUAL = '/@vite-plugin-react-layouts/generated-layouts';

export function defaultImportMode(name: string) {
  if (process.env.VITE_SSG)
    return 'sync';
  return name === 'default' ? 'sync' : 'async';
}


export default function layoutPlugin(userOptions: UserOptions = {}): Plugin {

  let config: ResolvedConfig;
  const options: Options = Object.assign({
    defaultLayout: 'default',
    layoutDirs: 'src/layouts',
    extensions: ['tsx'],
    exclude: [],
    importMode: defaultImportMode
  }, userOptions);

  return {
    name: 'vite-plugin-react-layouts',
    enforce: 'pre',
    configResolved: resolveConfig => {
      config = resolveConfig;
    },
    resolveId: id => {
      return MODULE_IDS.includes(id) || MODULE_IDS.some(i => id.startsWith(i))
        ? MODULE_ID_VIRTUAL
        : null;
    },
    load: async id => {
      if (id === MODULE_ID_VIRTUAL) {
        const layoutDirs = Array.isArray(options.layoutDirs) ? options.layoutDirs : [options.layoutDirs];
        const container = await Promise.all<FileContainer>(layoutDirs.map(async dir => {
          const layoutsDirPath = dir.startsWith('/') ? normalizePath(dir) : normalizePath(_resolve(config.root, dir));
          const layoutFiles = await getFilesFromPath(layoutsDirPath, options);
          return {
            path: layoutsDirPath,
            files: layoutFiles
          };
        }));

        const importCode = getImportCode(container, options);
        return getClientCode(importCode, options);
      }
    }
  };
}
export * from './types';

