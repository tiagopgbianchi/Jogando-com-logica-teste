import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  // command === 'serve' when running `vite` or `npm run dev`
  // command === 'build' when running `vite build` or `npm run build`
  
  return {
    base: command === 'build' ? '/Jogando-com-logica/' : '/',
    plugins: [react()],
  }
})