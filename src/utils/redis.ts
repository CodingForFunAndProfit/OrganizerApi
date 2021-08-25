import Redis from 'ioredis';

export const redis = new Redis(process.env.REDISLABSURL, {
    password: process.env.REDISLABSPASSWORD,
    // showFriendlyErrorStack: process.env.NODE_ENV.trim() !== 'production',
    showFriendlyErrorStack: process.env.NODE_ENV !== 'production',
    lazyConnect: true,
    maxRetriesPerRequest: 10,
});
