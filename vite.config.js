const path = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "PrintcartDesigner",
      fileName: (format) => {
        if (format === "umd") {
          return "main.js";
        }

        return `main.${format}.js`;
      },
    },
  },
  // server: {
  //   hmr: {
  //     // clientPort: 443,
  //     protocol: "ws",
  //     port: 3101,
  //   },
  // },
});
