import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@src": path.resolve(__dirname, "./src"),
			"@lib": path.resolve(__dirname, "./src/lib"),
			"@ui": path.resolve(__dirname, "./src/components/ui"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@pages": path.resolve(__dirname, "./src/pages"),
			"@assets": path.resolve(__dirname, "./src/assets"),
			"@hooks": path.resolve(__dirname, "./src/hooks"),
			"@store": path.resolve(__dirname, "./src/store"),
			"@models": path.resolve(__dirname, "./src/models"),
		},
	},
	plugins: [react()],
});
