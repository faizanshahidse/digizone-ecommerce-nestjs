import nodemailer from 'nodemailer';
import config from 'config';

// client id, client sercet, refresh token and access token configuration is done through Google Developer Consile
// for more details visit https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a

// Less secure way is no longer exist in gmail with username and password in auth
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // this port is working it operates on ssl
  // port: 587, // this port does not work with nodemailer it operates on tls
  secure: true, // Use `true` for port 465, `false` for all other ports
  // service: 'gmail',
  auth: {
    type: config.get('MAIL.TYPE'),
    user: config.get('MAIL.USERNAME'),
    clientId: config.get('MAIL.CLIENT_ID'),
    clientSecret: config.get('MAIL.CLIENT_SECRET'),
    refreshToken: config.get('MAIL.REFRESH_TOKEN'),
    accessToken: config.get('MAIL.ACCESS_TOKEN'),
  },
});

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to, subject, html) {
  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: config.get('MAIL.USERNAME'), // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: 'Hello world?', // plain text body
      html: html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  } catch (error) {
    console.log(error);
  }
}
