import fs from "node:fs"
import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import Icons from "unplugin-icons/vite"
import { defineConfig } from "vite"
import checker from "vite-plugin-checker"

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
			routesDirectory: "./src/routes",
			generatedRouteTree: "./src/routeTree.gen.ts",
			routeFileIgnorePrefix: "-",
			quoteStyle: "single",
		}),
		react(),
		babel({
			presets: [reactCompilerPreset()],
		}),
		Icons({ compiler: "jsx", jsx: "react" }),
		checker({
			typescript: true,
		}),
		tailwindcss(),
	],
	resolve: {
		tsconfigPaths: true,
	},
	server: {
		hmr: true,
		https: {
			key: fs.readFileSync("./.certs/localhost-key.pem"),
			cert: fs.readFileSync("./.certs/localhost.pem"),
		},
		proxy: {
			"/api": {
				target: "http://localhost:8000",
				changeOrigin: true,
				secure: false,
			},
		},
	},
})
