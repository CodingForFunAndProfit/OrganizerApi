import { Request, Response, Router } from 'express';

const router: Router = Router();

// tslint:disable-next-line: variable-name
router.get('/', (_req: Request, res: Response) => {
    res.send('Hello, World!');
});

export const HelloController: Router = router;
