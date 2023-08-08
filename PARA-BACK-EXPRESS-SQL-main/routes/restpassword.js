const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const nodemailer = require('nodemailer');


// User model

const db = require("../lib/db");

// Secret key for JWT


// Route for requesting a password reset
router.post('/forgot-password', async (req, res) => {
        try {
        // Find user by email
            db.query( `SELECT * FROM users WHERE Email = ?;`,
            [req.body.email],
            (err, result) => {
                if (err) {
                    return res.status(400).send({
                        message: err,
                    });
                }
                else if (!result.length) {
                    return res.status(400).send({
                        message: 'Email in not used!',
                    });
                }
                else if(result.length==1){

                    // Create JWT token for password reset
                    let mail =[req.body.email];
                    const token = jwt.sign({ id: result[0].id }, process.env.secretKey, { expiresIn: '1h' });
                    // Send password reset email to user with token
                    // Create a transport object with the details of the email service you'll be using
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'baya.hisham@gmail.com',
                            pass: 'hgbapaurwkfmqsjf'
                        }
                    });

                    // Function to send password reset email to user with token
                    async function sendPasswordResetEmail(mail, token) {
                        // Create mail options object with details of the email
                        const mailOptions = {
                            from: 'youremail@gmail.com',
                            to: mail,
                            subject: 'Password Reset',
                            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://localhost:3000/api/secret-route\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
                        };

                        // Send email using transporter object

                        await transporter.sendMail(mailOptions);
                    }
                    sendPasswordResetEmail(mail, token);
                    // ...
                    res.json({ message: 'Password reset email sent' });

                }

                });

    //     // If user not found, return error
    //     if (!user) {
    //         return res.status(400).json({ message: 'email not found' });
    //     }
    //
    //     // Create JWT token for password reset
    //     const token = jwt.sign({ id: user._id }, process.env.secretKey, { expiresIn: '1h' });
    //
    //     // Send password reset email to user with token
    //     // ...
    //
    //     res.json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route for resetting password
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, secretKey);

        // Find user by id from decoded token
        const user = await User.findById(decoded.id);

        // If user not found, return error
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Hash new password and update user in database
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
