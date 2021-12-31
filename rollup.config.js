import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';

dotenv.config();

export default {
  input: "main.js",
  output: {
    dir: 'dist',
    format: "iife",
  },
  plugins: [
    replace({
      __DESIGN_TOOL_URL__: JSON.stringify(process.env.DESIGN_TOOL_URL),
    })
  ]
};
