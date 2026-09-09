import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages sirve este proyecto en:
  // https://logitrans-desarrollos.github.io/formaciones-2027/
  // por eso el base debe coincidir EXACTAMENTE con el nombre del repositorio.
  base: '/formaciones-2027/',
  plugins: [react(), tailwindcss()],
})
