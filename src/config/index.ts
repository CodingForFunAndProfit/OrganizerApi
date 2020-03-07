export interface IDatabaseConfig {
    name: string;
    host: string;
    username: string;
    password: string;
    port: number;
    secret: string;
}

export const getDatabaseConfig = (): IDatabaseConfig => {
    const dbconfig: IDatabaseConfig = {
        host: process.env.DATABASE_HOST as string,
        name: process.env.DATABASE as string,
        password: process.env.DATABASE_PASSWORD as string,
        port: (process.env.DATABASE_PORT as unknown) as number,
        secret: process.env.DATABASE as string,
        username: process.env.DATABASE_USER as string
    };

    return dbconfig;
};

export default getDatabaseConfig;
