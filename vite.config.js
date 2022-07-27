const path = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "main.js"),
      name: "MyLib",
      fileName: (format) => {
        if (format === "umd") {
          return "main.min.js";
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
