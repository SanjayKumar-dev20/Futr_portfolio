import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Keep the 3D payload out of the critical path — it is lazy-imported
        // by SceneCanvas and must never block first paint of the hero copy.
        // Listing a package here forces it into the bundle whether or not it
        // is imported. There is deliberately no `three` entry: since the hero
        // moved to the client's video loop nothing renders a WebGL scene, and
        // naming three here would drag 885 kB back into dist for code that is
        // never reached. Re-add it when the Difference / Invest scenes land.
        manualChunks: {
          motion: ['gsap'],
        },
      },
    },
  },
})
