import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works from any GitHub Pages subpath
// (https://USER.github.io/REPO/) without rebuilding for a specific repo name.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2020', assetsDir: 'assets' },
})
