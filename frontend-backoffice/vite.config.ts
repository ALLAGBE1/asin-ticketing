import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // basicSsl()
  ],
  // base: "/metronic8/react/demo1/",
  base: '/',
  build: {
    chunkSizeWarningLimit: 3000,
  },
});
