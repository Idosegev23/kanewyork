require('dotenv').config(); // טעינת משתני סביבה מקובץ .env
const { sendRegistrationConfirmation } = require('./email-templates/registration-confirmation');

/**
 * מטפל בשליחת אימייל אישור הרשמה
 * 
 * @param {Object} formData - נתוני הטופס שהוגש
 * @returns {Promise<Object>} - תוצאת שליחת האימייל
 */
async function handleRegistrationEmail(formData) {
  try {
    // וידוא שיש את כל הנתונים הנדרשים
    if (!formData.name || !formData.email || !formData.workshop) {
      console.error('נתונים חסרים בטופס ההרשמה');
      return { success: false, error: 'נתונים חסרים בטופס ההרשמה' };
    }

    // שליחת אימייל אישור הרשמה
    const result = await sendRegistrationConfirmation({
      name: formData.name,
      email: formData.email,
      workshop: formData.workshop,
      phone: formData.phone || 'לא צוין'
    });

    return result;
  } catch (error) {
    console.error('שגיאה בשליחת אימייל אישור הרשמה:', error);
    return { success: false, error: error.message };
  }
}

// דוגמה לשימוש
// יש לקרוא לפונקציה זו לאחר הגשת הטופס והצלחת העיבוד שלו
/* 
document.getElementById('registration-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    workshop: document.getElementById('workshop').value,
    orna_discount: document.getElementById('orna_discount').checked
  };

  try {
    // טיפול בהגשת הטופס (שמירה במסד נתונים וכו')
    // ...
    
    // שליחת אימייל אישור
    const emailResult = await handleRegistrationEmail(formData);
    
    if (emailResult.success) {
      alert('ההרשמה הושלמה בהצלחה! אימייל אישור נשלח לכתובת שסיפקת.');
    } else {
      console.error('שגיאה בשליחת אימייל אישור:', emailResult.error);
      alert('ההרשמה הושלמה, אך הייתה שגיאה בשליחת אימייל האישור. אנא צור קשר אם לא קיבלת אימייל תוך מספר דקות.');
    }
    
    // העברה לעמוד תודה או איפוס הטופס
    // window.location.href = '/thank-you.html';
    this.reset();
    
  } catch (error) {
    console.error('שגיאה בעיבוד ההרשמה:', error);
    alert('אירעה שגיאה בעיבוד ההרשמה. אנא נסה שוב מאוחר יותר.');
  }
});
*/

module.exports = { handleRegistrationEmail }; 