import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Tambahkan baris ini, sesuaikan dengan nama repository Anda
  base: '/Portofolio-Akhmad-Febriyo-Febriyansyah/',
})