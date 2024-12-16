import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import UnoCSS from 'unocss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
      '~': path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        './node_modules',
      ),
      '~@semi-bot': path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        './node_modules/@semi-bot',
      ),
    },
  },
  server: {
    proxy: {
      /* '/api': {
        target: 'https://api.pinnacle-primary.mjclouds.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }, */
      '/api': {
        target: 'https://api.coze.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),// { '^/api': '' },
      },
      '/authorisation': {
        target: 'https://www.coze.cn/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/authorisation/, ''),// { '^/authorisation': '' },
        onProxyReq: (proxyReq: any, _req: any, _res: any) => {
          // 添加必要的头信息以处理 CORS
          proxyReq.setHeader('Origin', 'https://www.coze.cn');
        },
        onProxyRes: (proxyRes: any, req: any, res: any) => {
          // 允许跨域请求
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
          proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';

          // 处理重定向
          if (proxyRes.headers['location']) {
            proxyRes.headers['location'] = proxyRes.headers['location'].replace('https://www.coze.cn/sign', 'https://localhost:8000/sign');
          }
        },
      },
      '/sign': {
        target: 'https://www.coze.cn/sign',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sign/, ''),//{ '^/sign': '' },
      }
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "~@semi-bot/semi-theme-pinnacle/scss/index.scss";`,
        javascriptEnabled: true,
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api', 'import'],
      },
    },
  },
});
