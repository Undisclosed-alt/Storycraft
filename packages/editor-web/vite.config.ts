import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@supabase-functions': path.resolve(__dirname, '../../supabase/functions'),
    },
  },
  server: {
    fs: {
      allow: ['..', '../../supabase/functions'],
    },
  },
});
