import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: './',
  plugins: [
    tsconfigPaths({
      projects: [resolve(__dirname, 'tsconfig.json')],
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 8000,
  },
  clearScreen: false,
  build: {
    // Do not inline images and assets to avoid the phaser error
    // "Local data URIs are not supported"
    assetsInlineLimit: 0,
  },
})
