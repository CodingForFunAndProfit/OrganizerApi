import dotenv from 'dotenv';
dotenv.config();

if (!process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL = 'http://localhost:4200';
}

if (!process.env.CLIENT_ORIGINS) {
    process.env.CLIENT_ORIGINS = '*';
}
