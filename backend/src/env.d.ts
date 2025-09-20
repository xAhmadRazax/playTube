// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    PORT: string;
    MONGO_DB_URI: string;
    MONGO_DB_PASSWORD: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRY: string;
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRY: string;
    CORS_ORIGIN: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    RESEND_API_KEY: string;
  }
}
