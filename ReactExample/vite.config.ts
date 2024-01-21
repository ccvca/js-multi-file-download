import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { createRequire } from 'node:module';
const require = createRequire( import.meta.url );

console.error(path.resolve(
  require.resolve("../MultiFileDownload/package.json"),
  "../src"
));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  // optimizeDeps: {
  //   entries: ["multi-file-download"]
  // },
  resolve:{
    alias: {
      // 'multi-file-download' : '../MultiFileDownload1/src/index.ts',
      // 'multi-file-download' : '/@linked/multi-file-download/index.ts',
      // "/@linked/multi-file-download/index.ts": path.resolve(
      //   require.resolve("../MultiFileDownload/package.json"),
      //   "../src"
      // ),
      "multi-file-download": path.resolve(
        require.resolve("../MultiFileDownload/package.json"),
        "../src"
      ),
      // [
      //   {
      //     find: "multi-file-download", fileURLToPath(new URL('./src', import.meta.url))
      //   }
      // ]
    }
  },
  server: {
    proxy: {
      "/special" : {
        bypass(req, res, options) {
          // return 404
          return false;
        },
      }
    }
  }
})
