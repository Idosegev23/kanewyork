const nodemailer = require('nodemailer');

/**
 * שולח אימייל אישור הרשמה למשתתף
 * 
 * @param {Object} userData - נתוני המשתמש שנרשם
 * @param {string} userData.name - שם מלא
 * @param {string} userData.email - כתובת אימייל
 * @param {string} userData.workshop - הסדנה שנבחרה
 * @returns {Promise<Object>} - תוצאת שליחת האימייל
 */
async function sendRegistrationConfirmation(userData) {
  try {
    // יצירת טרנספורטר לשליחת מיילים
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // הפקת תאריך ושעה בפורמט עברי
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    
    // מנתח את מחרוזת הסדנה לקבלת התאריך
    const workshopDate = getWorkshopDate(userData.workshop);
    const formattedDate = workshopDate ? 
      workshopDate.toLocaleDateString('he-IL', options) : 
      userData.workshop;

    // בניית גוף האימייל בפורמט HTML
    const htmlEmail = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>אישור הרשמה לסדנת CXpert AI</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Heebo', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            direction: rtl;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          }
          
          .email-header {
            background: linear-gradient(135deg, #f9f9f9 0%, #f2f2f2 100%);
            padding: 30px 20px;
            text-align: center;
            border-bottom: 3px solid #D4AF37;
          }
          
          .logo {
            max-width: 200px;
            margin-bottom: 20px;
          }
          
          .email-content {
            padding: 40px 30px;
          }
          
          h1 {
            color: #D4AF37;
            margin-bottom: 20px;
            font-size: 26px;
          }
          
          p {
            margin-bottom: 15px;
            font-size: 16px;
          }
          
          .details-box {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            border-right: 4px solid #D4AF37;
          }
          
          .details-box h2 {
            font-size: 18px;
            color: #333;
            margin-bottom: 15px;
          }
          
          .detail-item {
            margin-bottom: 10px;
          }
          
          .detail-item strong {
            display: inline-block;
            min-width: 100px;
            color: #555;
          }
          
          .cta-button {
            display: inline-block;
            background-color: #D4AF37;
            color: white;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 50px;
            margin: 20px 0;
            font-weight: 500;
            text-align: center;
          }
          
          .email-footer {
            background-color: #f2f2f2;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
          
          .social-links {
            margin: 15px 0;
          }
          
          .social-link {
            display: inline-block;
            margin: 0 8px;
            color: #D4AF37;
            text-decoration: none;
          }
          
          .contact-info {
            margin-top: 15px;
          }
          
          .divider {
            height: 1px;
            background-color: #e5e5e5;
            margin: 20px 0;
          }
          
          @media screen and (max-width: 550px) {
            .email-content {
              padding: 30px 20px;
            }
          }
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
              
              <div class="detail-item">
                <strong>סדנה:</strong> ${userData.workshop}
              </div>
              
              <div class="detail-item">
                <strong>תאריך:</strong> ${formattedDate}
              </div>
              
              <div class="detail-item">
                <strong>מיקום:</strong> מרכז החדשנות CXpert, תל אביב
              </div>
              
              <div class="detail-item">
                <strong>שם מלא:</strong> ${userData.name}
              </div>
              
              <div class="detail-item">
                <strong>אימייל:</strong> ${userData.email}
              </div>
            </div>
            
            <p>מספר ימים לפני הסדנה, תקבל/י אימייל נוסף עם מידע מפורט יותר וכל מה שצריך לדעת לקראת הסדנה.</p>
            
            <p>אם יש לך שאלות נוספות בינתיים, אל תהסס/י ליצור איתנו קשר.</p>
            
            <p style="text-align: center;">
              <a href="https://kanewyork.com/workshop-details" class="cta-button">לפרטים נוספים על הסדנה</a>
            </p>
            
            <div class="divider"></div>
            
            <p>בברכה,<br>צוות CXpert AI</p>
          </div>
          
          <div class="email-footer">
            <div class="contact-info">
              <p>שאלות? צור/י קשר: <a href="mailto:kochavith.arnon@gmail.com">kochavith.arnon@gmail.com</a> | <a href="https://wa.me/972523030009">052-303-0009</a></p>
            </div>
            
            <p>&copy; 2025 CXpert AI. כל הזכויות שמורות.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // הגדרות האימייל
    const mailOptions = {
      from: `"CXpert AI" <${process.env.EMAIL_USER}>`,
      to: userData.email,
      subject: `אישור הרשמה: סדנת ${userData.workshop} | CXpert AI`,
      html: htmlEmail,
      // הגדרות נוספות לתמיכה בעברית
      headers: {
        'Content-Type': 'text/html; charset=UTF-8'
      }
    };

    // שליחת האימייל
    const info = await transporter.sendMail(mailOptions);
    console.log(`אימייל אישור הרשמה נשלח: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('שגיאה בשליחת אימייל אישור הרשמה:', error);
    return { success: false, error: error.message };
  }
}

/**
 * מפענח את תאריך הסדנה מתוך מחרוזת
 * 
 * @param {string} workshopString - שם הסדנה המכיל את התאריך
 * @returns {Date|null} - אובייקט תאריך או null אם לא נמצא תאריך
 */
function getWorkshopDate(workshopString) {
  // מיפוי חודשים לפי שם באנגלית
  const months = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3,
    'May': 4, 'June': 5, 'July': 6, 'August': 7,
    'September': 8, 'October': 9, 'November': 10, 'December': 11
  };
  
  try {
    // מנסה לזהות תבנית תאריך בסגנון "June 1" או מתקדם יותר
    const datePattern = /(\w+)\s+(\d+)/;
    const match = workshopString.match(datePattern);
    
    if (match && months[match[1]] !== undefined) {
      const month = months[match[1]];
      const day = parseInt(match[2], 10);
      return new Date(2025, month, day, 10, 0); // מניח שהסדנאות מתחילות ב-10:00
    }
    
    return null;
  } catch (error) {
    console.error('שגיאה בפענוח תאריך הסדנה:', error);
    return null;
  }
}

module.exports = { sendRegistrationConfirmation }; 