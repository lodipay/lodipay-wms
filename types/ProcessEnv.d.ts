declare namespace NodeJS {
    export interface ProcessEnv {
        ENVIRONMENT: string;
        WHS_PORT: number;
        WHS_DB_HOST: string;
        WHS_DB_PORT: string;
        WHS_DB_USER: string;
        WHS_DB_PASSWORD: string;
        WHS_DB: string;
        LOG_TRANSPORT: string;
        LOG_FILE_LOCATION: string;
        LOG_KEEP_DAY: number;
    }
}
