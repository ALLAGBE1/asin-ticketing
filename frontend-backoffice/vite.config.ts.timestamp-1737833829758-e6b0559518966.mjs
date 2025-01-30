// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import react from "file:///D:/documents/Epitech/STARTUP%20WEEKEND/asin-ticketing/frontend-backoffice/node_modules/.pnpm/@vitejs+plugin-react@4.3.4_vite@5.4.14_@types+node@22.10.10_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///D:/documents/Epitech/STARTUP%20WEEKEND/asin-ticketing/frontend-backoffice/node_modules/.pnpm/vite@5.4.14_@types+node@22.10.10/node_modules/vite/dist/node/index.js";
import tailwindcss from "file:///D:/documents/Epitech/STARTUP%20WEEKEND/asin-ticketing/frontend-backoffice/node_modules/.pnpm/tailwindcss@3.4.17/node_modules/tailwindcss/lib/index.js";
var __vite_injected_original_import_meta_url = "file:///D:/documents/Epitech/STARTUP%20WEEKEND/asin-ticketing/frontend-backoffice/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  },
  base: "/metronic/tailwind/react",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  build: {
    chunkSizeWarningLimit: 3e3
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxkb2N1bWVudHNcXFxcRXBpdGVjaFxcXFxTVEFSVFVQIFdFRUtFTkRcXFxcYXNpbi10aWNrZXRpbmdcXFxcZnJvbnRlbmQtYmFja29mZmljZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcZG9jdW1lbnRzXFxcXEVwaXRlY2hcXFxcU1RBUlRVUCBXRUVLRU5EXFxcXGFzaW4tdGlja2V0aW5nXFxcXGZyb250ZW5kLWJhY2tvZmZpY2VcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2RvY3VtZW50cy9FcGl0ZWNoL1NUQVJUVVAlMjBXRUVLRU5EL2FzaW4tdGlja2V0aW5nL2Zyb250ZW5kLWJhY2tvZmZpY2Uvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAndGFpbHdpbmRjc3MnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIGNzczoge1xuICAgIHBvc3Rjc3M6IHtcbiAgICAgIHBsdWdpbnM6IFt0YWlsd2luZGNzcygpXVxuICAgIH1cbiAgfSxcbiAgYmFzZTogJy9tZXRyb25pYy90YWlsd2luZC9yZWFjdCcsXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcbiAgICB9XG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAzMDAwXG4gIH1cbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxWixTQUFTLGVBQWUsV0FBVztBQUN4YixPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxpQkFBaUI7QUFIeU8sSUFBTSwyQ0FBMkM7QUFLbFQsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLFNBQVMsQ0FBQyxZQUFZLENBQUM7QUFBQSxJQUN6QjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCx1QkFBdUI7QUFBQSxFQUN6QjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
