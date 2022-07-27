const path = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "main.js"),
      name: "MyLib",
      fileName: (format) => `main.${format}.js`,
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
