const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// טוען משתני סביבה מקובץ .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware לעיבוד JSON ובקשות URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// פונקציה לקבלת תאריך הסדנה מתוך מחרוזת
// (זהה לפונקציה בקובץ email-templates/registration-confirmation.js)
function getWorkshopDate(workshopString) {
    if (!workshopString) return null;

    const workshopMapping = {
        'June 1 – Exposure': new Date(2025, 5, 1, 10, 0, 0), // June is month 5 (0-indexed)
        'June 10 – Repeat Exposure': new Date(2025, 5, 10, 10, 0, 0),
        'July 6 – Advanced': new Date(2025, 6, 6, 10, 0, 0),   // July is month 6
        'August 3 – Advanced': new Date(2025, 7, 3, 10, 0, 0), // August is month 7
        'September 7 – Advanced': new Date(2025, 8, 7, 10, 0, 0) // September is month 8
    };
    return workshopMapping[workshopString] || null;
}


// נקודת קצה לשליחת אימייל אישור
app.post('/send-confirmation-email', async (req, res) => {
    const userData = req.body;

    if (!userData || !userData.email || !userData.name || !userData.workshop) {
        return res.status(400).json({ success: false, message: 'Missing user data' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: 'America/New_York' // חשוב לוודא שהשעה נכונה
        };
        
        const workshopDate = getWorkshopDate(userData.workshop);
        const formattedDate = workshopDate ? 
          workshopDate.toLocaleDateString('he-IL', options) : 
          userData.workshop;

        const htmlEmail = `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>אישור הרשמה לסדנת CXpert AI</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');
            body { font-family: 'Heebo', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; direction: rtl; margin:0; padding:0; }
            .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); }
            .email-header { background: linear-gradient(135deg, #f9f9f9 0%, #f2f2f2 100%); padding: 30px 20px; text-align: center; border-bottom: 3px solid #D4AF37; }
            .logo { max-width: 180px; margin-bottom: 15px; }
            .email-content { padding: 30px 25px; }
            h1 { color: #D4AF37; margin-bottom: 20px; font-size: 24px; }
            p { margin-bottom: 15px; font-size: 16px; }
            .details-box { background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 25px 0; border-right: 4px solid #D4AF37; }
            .details-box h2 { font-size: 18px; color: #333; margin-bottom: 15px; }
            .detail-item { margin-bottom: 10px; }
            .detail-item strong { display: inline-block; min-width: 90px; color: #555; }
            .cta-button { display: inline-block; background-color: #D4AF37; color: white !important; text-decoration: none; padding: 10px 25px; border-radius: 50px; margin: 20px 0; font-weight: 500; text-align: center; }
            .email-footer { background-color: #f2f2f2; padding: 20px; text-align: center; font-size: 13px; color: #666; }
            .contact-info a { color: #D4AF37; text-decoration:none; }
            .divider { height: 1px; background-color: #e5e5e5; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <img class="logo" src="https://res.cloudinary.com/dsoh3yteb/image/upload/v1742806446/Logo2025_xbrzm3.png" alt="CXpert AI לוגו">
            </div>
            <div class="email-content">
              <h1>ברכות על הרשמתך לסדנת CXpert AI!</h1>
              <p>שלום ${userData.name},</p>
              <p>תודה שנרשמת לסדנת CXpert AI. אנו מאושרים לקבל אותך לקהילת הלומדים שלנו ומצפים לראות אותך בסדנה!</p>
              <div class="details-box">
                <h2>פרטי הסדנה:</h2>
                <div class="detail-item"><strong>סדנה:</strong> ${userData.workshop}</div>
                <div class="detail-item"><strong>תאריך ושעה:</strong> ${formattedDate} (שעון ניו ג\'רסי)</div>
                <div class="detail-item"><strong>מיקום:</strong> זום בלבד (קישור יישלח בסמוך למועד הסדנה)</div>
                <div class="detail-item"><strong>שם מלא:</strong> ${userData.name}</div>
                <div class="detail-item"><strong>אימייל:</strong> ${userData.email}</div>
              </div>
              <p>מספר ימים לפני הסדנה, תקבל/י אימייל נוסף עם מידע מפורט יותר, כולל קישור למפגש וכל מה שצריך לדעת לקראת הסדנה.</p>
              <p>אם יש לך שאלות נוספות בינתיים, אל תהסס/י ליצור איתנו קשר.</p>
              <p style="text-align: center;">
                <a href="https://www.kanewyork.com" class="cta-button">לאתר הראשי של CXpert AI</a>
              </p>
              <div class="divider"></div>
              <p>בברכה,<br>צוות CXpert AI</p>
            </div>
            <div class="email-footer">
              <div class="contact-info">
                <p>שאלות? צור/י קשר: <a href="mailto:${process.env.EMAIL_USER || 'kochavith.arnon@gmail.com'}">${process.env.EMAIL_USER || 'kochavith.arnon@gmail.com'}</a></p>
                <p><a href="https://wa.me/972523030009">+972 52-303-0009</a></p>
              </div>
              <p>&copy; ${new Date().getFullYear()} CXpert AI. כל הזכויות שמורות.</p>
            </div>
          </div>
        </body>
        </html>`;

        const mailOptions = {
            from: `"CXpert AI" <${process.env.EMAIL_USER}>`,
            to: userData.email,
            subject: `אישור הרשמה: סדנת ${userData.workshop} | CXpert AI`,
            html: htmlEmail,
            headers: {
                'Content-Type': 'text/html; charset=UTF-8'
            }
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', userData.email);
        res.json({ success: true, message: 'Confirmation email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send confirmation email.', error: error.message });
    }
});

// הגשת קבצים סטטיים (אם האתר עצמו יוגש מאותו שרת בעתיד)
// app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
}); 