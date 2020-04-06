import winston from 'winston';
import 'winston-daily-rotate-file';
import * as fs from 'fs';
import * as path from 'path';
import appRoot from 'app-root-path';
import DailyRotateFile from 'winston-daily-rotate-file';

import { Service, Inject } from 'typedi';
@Service()
export class LoggerStream {
    public logDirectory: string;
    public errorfile: DailyRotateFile;
    public infofile: DailyRotateFile;
    public console: any;
    public logger: winston.Logger;

    constructor() {
        this.logDirectory = path.resolve(`${appRoot}`, 'logs');
        if (!fs.existsSync(this.logDirectory)) {
            fs.mkdirSync(this.logDirectory);
        }
        this.infofile = new winston.transports.DailyRotateFile({
            level: 'info',
            filename: path.resolve(
                this.logDirectory,
                'application-%DATE%-info.log'
            ),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '2d', // keep logs for 2 days
        });
        this.errorfile = new winston.transports.DailyRotateFile({
            level: 'error',
            filename: path.resolve(
                this.logDirectory,
                'application-%DATE%-error.log'
            ),
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '5m',
            maxFiles: '2d', // keep logs for 4 days
        });
        this.console = {
            level: 'info',
            handleExceptions: true,
            format: winston.format.simple(), // disable json format
            colorize: true,
        };
        if (process.env.NODE_ENV === 'test') {
            this.logger = winston.createLogger({
                transports: [
                    new winston.transports.Console({ level: 'error' }),
                ],
            });
        } else {
            this.logger = winston.createLogger({
                transports: [
                    this.infofile,
                    this.errorfile,
                    new winston.transports.Console(this.console),
                ],
            });
        }
    }

    write(message: string) {
        this.logger.info(message);
    }

    public error(message: string, obj?: object) {
        if (message && message !== '') {
            this.logger.error(message);
        }
        if (obj) {
            this.logger.error(obj);
        }
    }
    public info(message: string, obj?: object) {
        if (message && message !== '') {
            this.logger.info(message);
        }
        if (obj) {
            this.logger.info(obj);
        }
    }
}
const logger = new LoggerStream();

export default logger;
