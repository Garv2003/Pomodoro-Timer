import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestForPlugIn: Partial<VitePWAOptions> = {
  includeAssets: ['favicon.ico'],
  manifest: {
    name: "Pomodoro Timer",
    short_name: "Pomodoro",
    description: "A simple Pomodoro Timer PWA",
    icons: [{
      src: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'favicon'
    },
    {
      src: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'favicon'
    },
    {
      src: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
      purpose: 'apple touch icon',
    },
    {
      src: '/maskable_icon.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable',
    }

    ],
    theme_color: '#171717',
    background_color: '#f0e7db',
    display: "standalone",
    scope: '/',
    start_url: "/",
    orientation: 'portrait',
    screenshots: [
      {
        src: '/Screenshot.png',
        sizes: '3199x1709',
        type: 'image/png',
      }
    ]
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,png,jpg,svg,ttf}'],
  },
  registerType: 'autoUpdate',
  devOptions: {
    enabled: true,
  },
}

export default defineConfig({
  plugins: [solid(), VitePWA(manifestForPlugIn)],
})
