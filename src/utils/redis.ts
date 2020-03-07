import Redis from 'ioredis';
// import debug from 'debug';

export const redis = new Redis(process.env.REDISLABSURL, {
    password: process.env.REDISLABSPASSWORD,
    showFriendlyErrorStack: process.env.NODE_ENV !== 'production'
});
/*
redis.on('error', (error: any) => {
    debug(error);
});
*/
