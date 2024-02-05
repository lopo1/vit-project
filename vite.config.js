import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
import Componets from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    Componets({
    resolvers: [ElementPlusResolver()],
  }),
],
  server: {
    host: '0.0.0.0', // 解决 Network: use `--host` to expose
    port: 3000,
    open: true,
  },
  // 配置别名
  resolve: {
    alias: [
        {
            find: '@',
            replacement: path.resolve(__dirname, 'src')
        }
    ]
},
})
