require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Serve static files (for serving the HTML form)
app.use(express.static('public'));

app.post('/send-message', async (req, res) => {
    const { email, message } = req.body;
    console.log(message);
    console.log(email);

    if (!email || !message) {
        return res.status(400).json({ success: false, error: 'Email and message are required.' });
    }

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Set email options
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: 'New Contact Message',
        text: message
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ success: false, error: 'Error sending email: ' + error.message });
        }
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
