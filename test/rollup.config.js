import babel from 'rollup-plugin-babel';
import browsersync from 'rollup-plugin-browsersync';
import commonjs from 'rollup-plugin-commonjs';
import { eslint } from 'rollup-plugin-eslint';
import json from 'rollup-plugin-json';
import multiEntry from 'rollup-plugin-multi-entry';
import nodeResolve from 'rollup-plugin-node-resolve';
import nodeGlobals from 'rollup-plugin-node-globals';

export default {
  input: ['./test/setup/browser.js', './test/unit/**/*.js'],
  output: [
    {
      file: './test/tmp/__spec-build.js',
      format: 'umd',
      name: 'Toolkit',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [
    eslint({ exclude: ['./package.json'] }),
    commonjs(),
    multiEntry(),
    nodeGlobals(),
    nodeResolve(),
    json(),
    babel(),
    browsersync({
      server: {
        baseDir: ['test', 'test/tmp', 'node_modules'],
        index: 'runner.html'
      },
      open: true
    })
  ]
}
