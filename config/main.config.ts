import { registerAs } from '@nestjs/config';

export class MainConfig {
    inDevelopment: boolean;
    port: number;
    apiDomain: string;
}

export const CONFIG_NAME_MAIN = 'MAIN_CONFIG';

export default registerAs(CONFIG_NAME_MAIN, () => ({
    inDevelopment: process.env.ENVIRONMENT === process.env.ENVIRONMENT_DEV,
    port: process.env.WHS_PORT || 13000,
    apiDomain: process.env.API_URL,
}));
