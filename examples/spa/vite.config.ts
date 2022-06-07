import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-react-layouts';

export default defineConfig({
  plugins: [
    react(),
    Pages(),
    Layouts()
  ]
});
