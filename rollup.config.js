import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

// continued
export default {
    input: 'src/index.tsx',
    output: [
      {
        // file: pkg.main,
        dir: 'dist',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
        strict: false
      }
    ],
    plugins: [
      typescript({ objectHashIgnoreUnknownHack: true })
    ],
    external: ['react', 'react-dom']
}