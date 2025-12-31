import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const banner = `/**
 * ChaiPe.js - Web Monetisation Micropayment Library for UPI
 * Accept tips and micropayments with behavioral nudging
 * @version 1.0.0
 * @license MIT
 * @see https://github.com/srikanthlogic/ChaiPe
 */`;

export default [
    // UMD build (for browsers and Node.js)
    {
        input: 'src/index.js',
        output: {
            file: 'dist/chaipe.js',
            format: 'umd',
            name: 'ChaiPe',
            banner,
            exports: 'named',
            // Make sure ChaiPe is available globally
            footer: `
        if (typeof window !== 'undefined') {
          window.ChaiPe = ChaiPe.ChaiPe || ChaiPe.default || ChaiPe;
        }
      `
        },
        plugins: [resolve()]
    },

    // Minified UMD build
    {
        input: 'src/index.js',
        output: {
            file: 'dist/chaipe.min.js',
            format: 'umd',
            name: 'ChaiPe',
            banner,
            exports: 'named',
            footer: `
        if (typeof window !== 'undefined') {
          window.ChaiPe = ChaiPe.ChaiPe || ChaiPe.default || ChaiPe;
        }
      `
        },
        plugins: [
            resolve(),
            terser({
                format: {
                    comments: /^!/  // Keep banner comments
                },
                compress: {
                    drop_console: true,  // Remove console.log statements
                    pure_funcs: ['console.log', 'console.info', 'console.debug']
                },
                mangle: {
                    reserved: ['ChaiPe', 'ChaiPeCore', 'QRCode']  // Keep API names
                }
            })
        ]
    },

    // ESM build (for modern bundlers)
    {
        input: 'src/index.js',
        output: {
            file: 'dist/chaipe.esm.js',
            format: 'es',
            banner
        },
        plugins: [resolve()]
    }
];
