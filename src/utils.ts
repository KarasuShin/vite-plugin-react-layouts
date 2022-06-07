import type { Options, FileContainer } from './types';
import fg from 'fast-glob';
import { parse, join } from 'path';

export function normalizePath(str: string): string {
  return str.replace(/\\/g, '/');
}

export const getFilesFromPath = async (path: string, options: Options) => {
  const { extensions, exclude } = options;
  const ext = extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0] || '';
  return await fg(`**/*.${ext}`, {
    ignore: ['node_modules', '.git', '**/__*__/*', ...exclude],
    onlyFiles: true,
    cwd: path,
  });
};

export const getImportCode = (files: FileContainer[], options: Options) => {
  const imports: string[] = [];
  const head: string[] = [];
  let id = 0;

  files.forEach(group => {
    group.files.forEach(file => {
      const path = group.path.startsWith('/') ? `${group.path}/${file}` : `/${group.path}/${file}`;
      const parsed = parse(file);
      const name = join(parsed.dir, parsed.name).replace(/\\/g, '/');
      if (options.importMode(name) === 'sync') {
        const variable = `__layout_${id}`;
        head.push(`import ${variable} from '${path}'`);
        imports.push(`'${name}': ${variable},`);
        id += 1;
      } else {
        imports.push(`'${name}': () => import('${path}'),`);
      }
    });
  });

  return `
    ${head.join('\n')}
    export const layouts = {
      ${imports.join('\n')}
    } 
  `;
};

export const getClientCode = (importCode: string, options: Options) => {
  return `
      import { createElement, isValidElement } from 'react';
      ${importCode}
      
      export const setupLayouts = (routes) => {
        return routes.map((route) => ({
          path: route.path,
          element: createElement(layouts['${options.defaultLayout}']),
          children: [{
            ...route,
            path: ''
          }]
        }))
      };
    `;
};
