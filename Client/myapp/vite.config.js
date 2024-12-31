import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server:{
    port:5173,
    open:true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Set '@' to point to the 'src' directory
    },
  },
});
