/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_GC_CLIENT_ID: string;
	readonly VITE_API_GC_API_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
