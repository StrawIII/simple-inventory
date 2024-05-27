import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000
  },
  build: {
    rollupOptions: {
      input: {
        main: "./src/main.tsx",
        admin: "./src/routes/Admin.tsx"
      }
    }
  }
})
