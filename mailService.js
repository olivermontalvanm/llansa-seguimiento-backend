"use strict";
const nodemailer = require( "nodemailer" );
const config = require( "./config.js" );

class MailService {
    user;
    pass;
    
    constructor( ) {
        this.user = config.email.user;
        this.pass = config.email.password;
    }

    async sendMail( text ) {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: this.user, // Your Gmail address
                pass: this.pass,   // App password or Gmail account password
            },
        });
    
        const mailOptions = {
            from: '"Oliver Montalván" <olivermontalvanm@gmail.com>',
            to: "olivermontalvanm@gmail.com",
            subject: "Test",
            text,
            replyTo: "maynor3m@gmail.com"
        }
    
        const info = await transport.sendMail(mailOptions);
    
        console.log("Email sent: ", info.response);    
    }
}

const mailService = new MailService( );

module.exports = mailService;
