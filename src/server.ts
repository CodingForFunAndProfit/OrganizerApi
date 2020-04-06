import './config/env';

import Debug from 'debug';
import App from './app';

const debug = Debug('app');

if (process.env.NODE_ENV) {
    debug('NODE_ENV: "' + process.env.NODE_ENV.trim() + '"');
}

const httpPort = normalizePort(process.env.PORT || '8080');

const app = new App();
const httpServer = app.listen(httpPort as number);

httpServer.on('error', onError);
httpServer.on('listening', onListening);

export default httpServer;

function normalizePort(val: string) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const port = httpPort;
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = httpServer.address();
    const bind =
        typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

/*
import App from './app';

import * as bodyParser from 'body-parser';
import loggerMiddleware from './middleware/logger';

import PostsController from './controllers/posts/posts.controller';
import HomeController from './controllers/home/home.controller';

const app = new App({
    port: 5000,
    controllers: [new HomeController(), new PostsController()],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        loggerMiddleware,
    ],
});

export default app.listen();
*/
