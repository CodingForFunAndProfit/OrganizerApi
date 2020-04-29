import nodemailer from 'nodemailer';

export async function sendEmail(email: string, url: string) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAILHOST,
        port: 25,
        secure: false,
        auth: {
            user: process.env.EMAILACCOUNT,
            pass: process.env.EMAILPASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: '"Organizer" <organizer@kehdata.com>',
            to: email,
            subject: 'Confirm your registration',
            text: `Hi, please confirm your registration by visiting the following url: ${url}`,
            html: `Hi, please confirm your registration by clicking on the following link: <a href="${url}">${url}</a>`,
        });
    } catch (error) {
        console.error('Error:' + error);
    }

    // console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
