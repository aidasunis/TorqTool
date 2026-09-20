import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // El sitio se publica en https://aidasunis.github.io/TorqTool/, no en la raíz del
  // dominio — sin esto, todos los assets (JS, CSS, video, imágenes) se pedirían con
  // rutas absolutas equivocadas y la página cargaría en blanco en GitHub Pages.
  base: '/TorqTool/',
})
