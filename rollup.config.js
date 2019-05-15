import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import manifest from './package.json';

const globals = {
  'backbone': 'Backbone',
  'underscore': '_',
  'backbone.marionette': 'Marionette'
};

const banner = [
  '/**',
  ` * ${ manifest.name } - ${ manifest.description }`,
  ` * @version v${ manifest.version }`,
  ` * @link ${ manifest.homepage }`,
  ` * @license ${ manifest.license }`,
  ' */'
].join('\n');

export default [
  {
    input: 'src/marionette.toolkit.js',
    external: ['underscore', 'backbone', 'backbone.marionette'],
    output: [
      {
        file: 'dist/marionette.toolkit.js',
        format: 'umd',
        name: 'Toolkit',
        exports: 'named',
        sourcemap: true,
        globals,
        banner
      },
      {
        file: 'dist/marionette.toolkit.esm.js',
        format: 'es'
      }
    ],
    plugins: [
      eslint({ exclude: ['package.json'] }),
      json(),
      babel()
    ]
  },
  {
    input: 'src/marionette.toolkit.js',
    external: ['underscore', 'backbone', 'backbone.marionette'],
    output: [
      {
        file: 'dist/marionette.toolkit.min.js',
        format: 'umd',
        name: 'Toolkit',
        exports: 'named',
        sourcemap: true,
        globals,
        banner
      }
    ],
    plugins: [
      json(),
      babel(),
      terser({ output: { comments: /@license/ }})
    ]
  }
]
