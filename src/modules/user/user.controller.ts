import * as express from 'express';
import { Request, Response } from 'express';
import { Service } from 'typedi';

@Service()
export default class UserController {
    public path = '/user';
    public router = express.Router();

    constructor() {
        this.initRoutes();
    }
    public initRoutes() {
        this.router.get(this.path, this.index);
    }
    index = (req: Request, res: Response) => {
        res.send('Userlist');
    };
}
