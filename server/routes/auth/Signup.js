const nodemailer = require('nodemailer');
const crypto = require('crypto');

const { db } = require('../../config/db');
const { logger } = require("../../config/logger");

async function signup(req, res) {
    const { email } = req.body;

    try {
        const client = db.getDB();
        const result = await client.query('SELECT * FROM "user" WHERE email = $1', [email]);

        if (result.rows.length > 0) {
            return res.status(400).send({ message: 'Email already exists' });
        }

        // Generate verification code
        const verificationCode = crypto.randomInt(100000, 999999).toString();

        // Save email and code to db, so that we can verify it later
        await client.query('INSERT INTO "user" (email, verification_code) VALUES ($1, $2)', [email, verificationCode]);

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Epitrello Account Verification (${verificationCode})`,
            html: `
                <div style="font-family: 'Poppins', sans-serif; text-align: center; background-color: #f4f5f7; padding: 20px;">
                    <div style="background-color: #fff; padding: 32px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); max-width: 400px; margin: auto;">
                        <table style="width: 100%; margin-bottom: 20px;">
                            <tr>
                                <td style="text-align: right;">
                                    <img src="cid:logo" alt="Trello Logo" style="width: 36px; margin: 8px 5px 0 0" />
                                </td>
                                <td style="text-align: left;">
                                    <h2 style="font-size: 30px; color: #333; font-weight: bold; margin: 0;">EpiTrello</h2>
                                </td>
                            </tr>
                        </table>
                        <h1 style="font-size: 24px; color: #333; margin-bottom: 16px;">Account Verification</h1>
                        <p style="font-size: 16px; color: #666; margin-bottom: 24px;">Your verification code is:</p>
                        <div style="font-size: 24px; color: #333; font-weight: bold; margin-bottom: 24px;">${verificationCode}</div>
                        <p style="font-size: 14px; color: #666;">Please enter this code to verify your email address.</p>
                    </div>
                    <div style="margin-top: 20px; font-size: 12px; color: #999;">
                        &copy; ${new Date().getFullYear()} EpiTrello. All rights reserved.
                    </div>
                </div>
            `,
            attachments: [{
                filename: 'trello.png',
                path: __dirname + '/../../assets/trello.png',
                cid: 'logo'
            }]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger.write(`Error sending email: ${error.message}`);
                logger.log();
                return res.status(500).send({ message: 'Error sending verification email' });
            } else {
                logger.write(`Verification email sent: ${info.response}`);
                logger.log();
                return res.status(201).send({ message: 'Verification email sent' });
            }
        });
    } catch (err) {
        logger.write(`Error during signup: ${err.message}`);
        logger.log();
        res.status(500).send({ message: 'Internal server error' });
    }
}

module.exports = {
    routes: [
        {
            method: 'post',
            path: '/signup',
            protected: false,
            body: { "email": "email" },
            callback: signup
        }
    ]
}
