import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import dts from "vite-plugin-dts";

export default defineConfig({
  root: ".",
  build: {
    minify: "esbuild",
    lib: {
      entry: "./src/index.tsx",
      name: "ReactPdfBuildFiller",
      fileName: (format) => `react-pdf-build-filler.${format}.js`,
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "lodash.debounce"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
      },
      output: {
        comments: false,
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outDir: "dist/types",
    }),
    analyzer({
      openAnalyzer: true, // автоматично відкриває звіт після завершення збірки
      analyzerMode: "static", // варіанти: 'server', 'static', 'json'
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react-pdf-build-filler/react-pdf-build-filler.css": path.resolve(
        __dirname,
        "node_modules/react-pdf-build-filler/dist/react-pdf-build-filler.css",
      ),
    },
  },
  optimizeDeps: {
    include: ["lodash.debounce", "date-fns", "pdf-lib", "react-pdf-viewer"],
    exclude: ["react", "react-dom"],
    esbuildOptions: {
      treeShaking: true,
      minify: true,
    },
  },
});
