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
            subject: 'Account Verification',
            text: `Your verification code is: ${verificationCode}`,
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
