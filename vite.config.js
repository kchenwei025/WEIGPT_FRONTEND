import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "/weichatai/",
  plugins: [react()],
  // other configuration options
});
