/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GEONAMES_API_KEY: string
    readonly VITE_GEONAMES_BASE_URL: string
    readonly VITE_RAPID_API_KEY: string
    readonly VITE_RAPID_BASE_URL: string
    readonly VITE_RAPID_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}