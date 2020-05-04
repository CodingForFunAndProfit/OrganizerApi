import Email from 'email-templates';

export async function sendEmail(
    template: string,
    templateRoot: string,
    emailaddress: string,
    variables: any
) {
    let email: Email;
    try {
        email = new Email({
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
    } catch (error) {
        console.error(error);
        console.error(`templateRoot: ${templateRoot}`);
        return null;
    }
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
        })
        .catch((error) => {
            console.error(error);
            console.error(`templateRoot: ${templateRoot}`);
            return null;
        });
}
