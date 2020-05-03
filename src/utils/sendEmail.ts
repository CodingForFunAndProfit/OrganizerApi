import Email from 'email-templates';

export async function sendEmail(
    template: string,
    templateRoot: string,
    emailaddress: string,
    variables: any
) {
    try {
        const email = new Email({
            message: {
                from: '"Organizer" <organizer@kehdata.com>',
            },
            views: { root: templateRoot },
            send: true,
            transport: {
                host: process.env.EMAILHOST,
                port: 25,
                secure: false,
                auth: {
                    user: process.env.EMAILACCOUNT,
                    pass: process.env.EMAILPASSWORD,
                },
            },
        });
        email
            .send({
                template,
                message: {
                    to: emailaddress,
                },
                locals: variables,
            })
            .then(() => {
                console.log('Sent email.');
            });
    } catch (error) {
        console.error(error);
    }
}
