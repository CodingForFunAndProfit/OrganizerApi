import nodemailer from 'nodemailer';

export async function sendEmail(email: string, url: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAILACCOUNT,
            pass: process.env.EMAILPASSWORD,
        },
    });

    // send mail with defined transport object
    // const info =
    try {
        await transporter.sendMail({
            from: '"Organizer" <boss@kehdata.com>', // sender address
            to: email,
            subject: 'Confirm your registration',
            text: `${url}`,
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
