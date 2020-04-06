import * as express from 'express';
import { Request, Response } from 'express';

export default class HomeController {
    public path = '/';
    public router = express.Router();

    constructor() {
        this.initRoutes();
    }
    public initRoutes() {
        this.router.get('/', this.index);
    }
    index = (req: Request, res: Response) => {
        res.send('Hello World!');
    };
}
