import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite';
import laravel from 'laravel-vite-plugin'
import { wordpressPlugin, wordpressThemeJson } from '@roots/vite-plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const SITE_URL = (process.env.DDEV_PRIMARY_URL) ? process.env.DDEV_PRIMARY_URL : env.WP_SITE_URL;
  const THEME = (env.THEME_NAME) ? env.THEME_NAME : 'ddev-sage-press';

  return {
    base: `/wp-content/themes/${THEME}/public/build/`,
    server: {
      host: '0.0.0.0',
      allowedHosts: [
        '.ddev.site',
      ],
      origin: `${SITE_URL.replace(/:\d+$/, "")}:5173`,
      cors: {
        origin: /https?:\/\/([A-Za-z0-9\-\.]+)?(\.ddev\.site)(?::\d+)?$/,
      },
    },
    plugins: [
      tailwindcss(),
      laravel({
        input: [
          'resources/css/app.css',
          'resources/js/app.js',
          'resources/css/editor.css',
          'resources/js/editor.js',
        ],
        refresh: true,
      }),

      wordpressPlugin(),

      // Generate the theme.json file in the public/build/assets directory
      // based on the Tailwind config and the theme.json file from base theme folder
      wordpressThemeJson({
        disableTailwindColors: false,
        disableTailwindFonts: false,
        disableTailwindFontSizes: false,
      }),
    ],
    resolve: {
      alias: {
        '@scripts': '/resources/js',
        '@styles': '/resources/css',
        '@fonts': '/resources/fonts',
        '@images': '/resources/images',
      },
    },
  }
})
