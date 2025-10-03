import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  /* ------------ só afeta o dev-server (npm run dev) ------------ */
  server: {
    headers: {
      // REMOVA esta linha se não precisar de COOP.
      // Se quiser manter isolamento + permitir popup:
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
      // Se você também usa COEP, mantenha:
      // 'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },

  /* ------------ afeta vite preview ou vercel dev -------------- */
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    }
  }
});