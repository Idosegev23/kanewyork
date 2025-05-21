# מערכת שליחת אימייל אישור הרשמה

המערכת מיועדת לשליחת אימיילים מעוצבים לאישור הרשמה לסדנאות CXpert AI.

## התקנה

1. התקן את החבילות הדרושות:
   ```bash
   npm install nodemailer dotenv
   ```

2. צור קובץ `.env` בתיקיית הפרויקט הראשית והוסף את הפרטים הבאים:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password-here
   ```
   
   שים לב: אם אתה משתמש ב-Gmail, עליך ליצור סיסמה ייעודית לאפליקציה. ראה [הנחיות](https://support.google.com/accounts/answer/185833).

## שימוש

### אפשרות 1: שרת Node.js

אם אתה עובד עם שרת Node.js, תוכל להשתמש בפונקציה `handleRegistrationEmail` לשליחת האימייל לאחר קבלת נתוני הטופס:

```javascript
const { handleRegistrationEmail } = require('./send-confirmation-email');

// בעת קבלת נתוני טופס מהלקוח
app.post('/register', async (req, res) => {
  try {
    // שמירת הנתונים במסד הנתונים או בכל דרך אחרת
    // ...
    
    // שליחת אימייל אישור
    const emailResult = await handleRegistrationEmail(req.body);
    
    if (emailResult.success) {
      res.status(200).json({ success: true, message: 'ההרשמה הושלמה בהצלחה ואימייל אישור נשלח' });
    } else {
      console.error('שגיאה בשליחת אימייל אישור:', emailResult.error);
      res.status(200).json({ 
        success: true, 
        emailSent: false,
        message: 'ההרשמה הושלמה אך הייתה שגיאה בשליחת האימייל' 
      });
    }
  } catch (error) {
    console.error('שגיאה בעיבוד ההרשמה:', error);
    res.status(500).json({ success: false, message: 'אירעה שגיאה בעיבוד ההרשמה' });
  }
});
```

### אפשרות 2: שירותי Webhook (כמו Make.com)

אם אתה משתמש ב-Make.com (או Integromat לשעבר) או בכל פלטפורמת Webhook אחרת, תוכל להגדיר קריאה ל-API של שרת שמריץ את הקוד לשליחת האימייל.

## מבנה הקוד

- `email-templates/registration-confirmation.js` - תבנית האימייל המעוצב ופונקציית השליחה
- `send-confirmation-email.js` - לוגיקה לטיפול בנתוני הטופס ושליחת האימייל

## התאמות אפשריות

1. **שינוי עיצוב האימייל**: ערוך את משתנה `htmlEmail` בקובץ `email-templates/registration-confirmation.js`.
2. **הוספת שדות נוספים**: הוסף שדות לאובייקט `userData` בפונקציה `sendRegistrationConfirmation`.
3. **שינוי לוגו**: החלף את כתובת ה-URL של התמונה בתגית `<img class="logo">`.

## דיבאג ופתרון בעיות

אם האימייל לא נשלח:

1. בדוק שהגדרת נכון את משתני הסביבה `EMAIL_USER` ו-`EMAIL_PASS`.
2. אם אתה משתמש ב-Gmail, ודא שאפשרת גישה לאפליקציות פחות מאובטחות או שאתה משתמש בסיסמה ייעודית לאפליקציה.
3. בדוק את לוגים של השגיאות ב-console.

## דוגמה לפלט האימייל

האימייל המעוצב יכלול:
- לוגו CXpert AI
- כותרת אישור הרשמה
- פנייה אישית למשתתף לפי השם
- פרטי הסדנה (שם, תאריך, מיקום)
- פרטי המשתתף
- כפתור קריאה לפעולה
- פרטי יצירת קשר בתחתית האימייל 