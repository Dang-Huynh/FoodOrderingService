import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  host: true, // allows access via 127.0.0.1 and LAN IP
    port: 5173,
})
