/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_API_URL: string
  // add more variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
