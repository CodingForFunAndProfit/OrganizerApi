import * as express from 'express';
import { Request, Response } from 'express';
import { Service } from 'typedi';
import * as webpush from 'web-push';
import { Subscription } from '../../entity/subscription';
@Service()
export default class SubscriptionController {
    public path = '/push';
    public router = express.Router();

    constructor() {
        webpush.setVapidDetails(
            `mailto:${process.env.EMAILACCOUNT}`,
            process.env.VAPIDKEY_PUBLIC,
            process.env.VAPIDKEY_PRIVATE
        );
        this.initRoutes();
    }
    public initRoutes() {
        this.router.get(this.path, this.index);
    }

    // just for the very first implementation
    // create Notification logic
    index = async (req: Request, res: Response) => {
        const subscriptions = await Subscription.find();
        // console.log(subscriptions);
        const notificationPayload = {
            notification: {
                title: 'Hello World',
                body: 'This is the very first Notification!',
                icon: 'assets/icons/icon-192x192.png',
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1,
                },
                actions: [
                    {
                        action: 'explore',
                        title: 'Go to the site',
                    },
                ],
            },
        };
        Promise.all(
            subscriptions.map((sub) =>
                webpush.sendNotification(
                    JSON.parse(sub.subscription),
                    JSON.stringify(notificationPayload)
                )
            )
        )
            .then(() =>
                res
                    .status(200)
                    .json({ message: 'Newsletter sent successfully.' })
            )
            .catch((err) => {
                console.error('Error sending notification, reason: ', err);
                res.sendStatus(500);
            });
    };
}
