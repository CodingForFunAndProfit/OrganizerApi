import { Request, Response, Router } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from '../entity/User';
import { createAccessToken } from '../utils/createTokens';

const router: Router = Router();

// tslint:disable-next-line: variable-name
router.get('/', (_req: Request, res: Response) => {
    res.send('Hello, World!');
});

router.post('/refresh_token', async (req: Request, res: Response) => {
    const token = req.cookies.jid;
    if (!token) {
        return res.send({ ok: false, accessToken: '' });
    }
    let payload: any = null;
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (error) {
        // console.log(error);
        return res.send({ ok: false, accessToken: '' });
    }

    // Token is valid
    const user = await User.findOne({ id: payload.userId });

    if (!user) {
        return res.send({ ok: false, accessToken: '' });
    }

    return res.send({ ok: true, accessToken: createAccessToken(user.id) });
});

export const HelloController: Router = router;
