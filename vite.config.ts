import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'MobileDevice',
			formats: ['es'],
			fileName: 'index'
		},
		rollupOptions: {
			// Externalize dependencies - they won't be bundled
			external: [
				'@capacitor/filesystem',
				'@capacitor/camera',
				'@capacitor/preferences',
				'@capacitor/device',
				'crypto-js'
			],
			output: {
				// Preserve module structure for tree-shaking
				preserveModules: false,
				exports: 'named'
			}
		},
		sourcemap: true,
		// Generate TypeScript declarations via tsc, not Vite
		emptyOutDir: false
	}
});
