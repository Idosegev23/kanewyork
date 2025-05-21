document.addEventListener('DOMContentLoaded', function() {
    // Workshop dates data - all Sundays at 10:00 AM EST
    const workshopDates = [
        { date: new Date(2025, 5, 1), title: 'Exposure Workshop', price: 'Free', type: 'free', description: 'Practical tools and AI overview', value: 'June 1 – Exposure' },
        { date: new Date(2025, 5, 10), title: 'Repeat Exposure', price: '₪100', type: 'paid', description: 'For those who missed the first session', value: 'June 10 – Repeat Exposure' },
        { date: new Date(2025, 6, 6), title: 'Advanced Workshop', price: '₪100', type: 'paid', description: 'Deep dive into real AI workflows', value: 'July 6 – Advanced' },
        { date: new Date(2025, 7, 3), title: 'Advanced Workshop', price: '₪100', type: 'paid', description: 'Automation and advanced use cases', value: 'August 3 – Advanced' },
        { date: new Date(2025, 8, 7), title: 'Advanced Workshop', price: '₪100', type: 'paid', description: 'Implementation and strategy', value: 'September 7 – Advanced' }
    ];

    // Language toggle functionality
    const enLangBtn = document.getElementById('en-lang');
    const heLangBtn = document.getElementById('he-lang');
    let currentLang = 'en';

    // Language toggle event listeners
    enLangBtn.addEventListener('click', function() {
        setLanguage('en');
    });
    
    heLangBtn.addEventListener('click', function() {
        setLanguage('he');
    });

    // Set language function
    function setLanguage(lang) {
        currentLang = lang;
        
        // Update active button
        if (lang === 'en') {
            enLangBtn.classList.add('active');
            heLangBtn.classList.remove('active');
            document.body.classList.remove('rtl');
        } else {
            heLangBtn.classList.add('active');
            enLangBtn.classList.remove('active');
            document.body.classList.add('rtl');
        }
        
        // Update all translatable elements
        const elements = document.querySelectorAll('[data-en]');
        elements.forEach(element => {
            if (element.hasAttribute(`data-${lang}`)) {
                element.textContent = element.getAttribute(`data-${lang}`);
            }
        });
        
        // Update select options (special case)
        const workshopSelect = document.getElementById('workshop');
        if (workshopSelect) {
            Array.from(workshopSelect.options).forEach(option => {
                if (option.hasAttribute(`data-${lang}`)) {
                    option.textContent = option.getAttribute(`data-${lang}`);
                }
            });
        }
    }

    // Calendar view functionality
    let currentDate = new Date(2025, 5, 1); // Start with June 2025
    
    // Initialize the calendar
    updateCalendar(currentDate);
    
    // Month navigation
    document.getElementById('prev-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar(currentDate);
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar(currentDate);
    });
    
    function updateCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Update month display
        const monthNames = {
            en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            he: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
        };
        
        const monthName = monthNames[currentLang][month];
        document.getElementById('current-month').textContent = `${monthName} ${year}`;
        
        // Clear previous days
        const calendarDays = document.getElementById('calendar-days');
        calendarDays.innerHTML = '';
        
        // Get first day of the month
        const firstDay = new Date(year, month, 1);
        const startingDay = firstDay.getDay(); // Day of week (0-6)
        
        // Get last day of the month
        const lastDay = new Date(year, month + 1, 0).getDate();
        
        // Get last day of previous month
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        
        // Create calendar grid
        // Previous month days
        for (let i = startingDay - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.innerHTML = `<span class="day-number">${day}</span>`;
            calendarDays.appendChild(dayElement);
        }
        
        // Current month days
        for (let i = 1; i <= lastDay; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.innerHTML = `<span class="day-number">${i}</span>`;
            
            // Check if this day has a workshop
            const currentDateObj = new Date(year, month, i);
            const workshops = workshopDates.filter(workshop => {
                return workshop.date.getDate() === currentDateObj.getDate() && 
                       workshop.date.getMonth() === currentDateObj.getMonth() && 
                       workshop.date.getFullYear() === currentDateObj.getFullYear();
            });
            
            if (workshops.length > 0) {
                const workshop = workshops[0]; // Get first workshop if multiple
                dayElement.classList.add('workshop-date');
                
                if (workshop.type === 'free') {
                    dayElement.classList.add('free-workshop');
                }
                
                let workshopTitle = workshop.title;
                if (currentLang === 'he') {
                    // Simple title translation for Hebrew
                    if (workshopTitle === 'Exposure Workshop') {
                        workshopTitle = 'סדנת חשיפה';
                    } else if (workshopTitle === 'Repeat Exposure') {
                        workshopTitle = 'חשיפה חוזרת';
                    } else if (workshopTitle === 'Advanced Workshop') {
                        workshopTitle = 'סדנה מתקדמת';
                    }
                }
                
                dayElement.innerHTML += `<div class="workshop-info">${workshopTitle}</div>`;
                
                // Add click event to select workshop in form
                dayElement.addEventListener('click', function() {
                    document.getElementById('registration').scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    setTimeout(() => {
                        const workshopDropdown = document.getElementById('workshop');
                        for (let i = 0; i < workshopDropdown.options.length; i++) {
                            if (workshopDropdown.options[i].value === workshop.value) {
                                workshopDropdown.selectedIndex = i;
                                break;
                            }
                        }
                    }, 500);
                });
            }
            
            calendarDays.appendChild(dayElement);
        }
        
        // Next month days (to fill the grid)
        const totalDaysShown = startingDay + lastDay;
        const remainingCells = 42 - totalDaysShown; // 6 rows x 7 days = 42
        
        for (let i = 1; i <= remainingCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.innerHTML = `<span class="day-number">${i}</span>`;
            calendarDays.appendChild(dayElement);
        }
    }

    // Animate calendar cards on scroll
    const calendarCards = document.querySelectorAll('.calendar-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adding a small delay to each card for staggered animation
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100 * Array.from(calendarCards).indexOf(entry.target));
            }
        });
    }, { threshold: 0.1 });

    calendarCards.forEach(card => {
        observer.observe(card);
    });

    // Set up register button functionality
    const registerButtons = document.querySelectorAll('.register-button');
    registerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the workshop value from the data attribute
            const workshopValue = this.getAttribute('data-select');
            
            // Scroll to the form
            document.getElementById('registration').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Set the dropdown value
            setTimeout(() => {
                const workshopDropdown = document.getElementById('workshop');
                for (let i = 0; i < workshopDropdown.options.length; i++) {
                    if (workshopDropdown.options[i].value === workshopValue) {
                        workshopDropdown.selectedIndex = i;
                        break;
                    }
                }
            }, 500); // Delay to ensure scroll is complete
        });
    });

    // Form validation and submission
    const form = document.getElementById('registration-form');
    form.addEventListener('submit', function(e) {
        // מונע את השליחה הרגילה כדי שנוכל לנהל את השליחה בצורה מותאמת
        e.preventDefault(); 
        
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phone');
        const workshopField = document.getElementById('workshop');
        
        let isValid = true;
        
        // Basic validation
        if (!nameField.value.trim()) {
            highlightError(nameField);
            isValid = false;
        }
        
        if (!emailField.value.trim() || !isValidEmail(emailField.value)) {
            highlightError(emailField);
            isValid = false;
        }
        
        if (!phoneField.value.trim()) {
            highlightError(phoneField);
            isValid = false;
        }
        
        if (!workshopField.value) {
            highlightError(workshopField);
            isValid = false;
        }
        
        if (isValid) {
            // הכנת נתוני הטופס
            const formData = new FormData(form);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // הצגת מחוון טעינה
            const submitBtn = form.querySelector('.submit-button');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = currentLang === 'he' ? 'שולח...' : 'Sending...';
            submitBtn.disabled = true;
            
            // 1. שליחה ל-Make.com באמצעות fetch
            fetch('https://hook.eu2.make.com/4xskepi8nslj99x5vaihc0dif4kmk2t4', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataObj)
            })
            .then(response => {
                console.log('Form submitted to Make.com:', response);
                
                // 2. שליחת אימייל באמצעות השרת המקומי
                // אם השליחה ל-Make הצליחה, ננסה לשלוח אימייל
                if (response.ok) { // או כל תנאי אחר שמעיד על הצלחה מ-Make.com
                    return fetch('/send-confirmation-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formDataObj)
                    });
                } else {
                    // אם השליחה ל-Make נכשלה, נזרוק שגיאה כדי לדלג על שליחת המייל
                    // אבל עדיין להציג את הפופאפ ב-catch
                    return response.text().then(text => { 
                        throw new Error('Make.com submission failed: ' + text);
                    });
                }
            })
            .then(emailResponse => {
                // רק אם הקריאה לשרת המקומי התבצעה והצליחה
                if (emailResponse && emailResponse.ok) {
                    return emailResponse.json();
                } else if (emailResponse) {
                    // אם הייתה תגובה מהשרת אך היא לא הצלחה
                    return emailResponse.text().then(text => {
                         console.error('Error response from email server:', text);
                         // החזרת אובייקט שמציין כישלון בשליחת המייל אבל לא עוצר את הצגת הפופאפ
                         return { success: false, message: 'Email server responded with an error: ' + text }; 
                    });
                }
                // אם לא הייתה קריאה לשרת (למשל כי Make.com נכשל)
                return { success: false, message: 'Email not sent due to Make.com failure.', makeFailure: true }; 
            })
            .then(data => {
                if (data.success) {
                    console.log('Email sent successfully:', data);
                } else if (!data.makeFailure) { // אל תציג שגיאת אימייל אם הכישלון היה ב-Make
                    console.error('Failed to send email:', data.message);
                }
                
                // 3. הצגת פופאפ אישור בכל מקרה (הצלחה או כישלון של המייל)
                showConfirmationPopup(formDataObj);
                form.reset();
            })
            .catch(error => {
                console.error('Form submission process error:', error);
                // הצג פופאפ גם במקרה של שגיאה בתהליך
                showConfirmationPopup(formDataObj);
                form.reset();
            })
            .finally(() => {
                // איפוס כפתור השליחה
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        }
    });
    
    // Helper functions
    function highlightError(field) {
        field.style.borderColor = '#ff3860';
        field.addEventListener('input', function() {
            field.style.borderColor = '';
        }, { once: true });
    }
    
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // פונקציה ליצירת קישור להוספה ליומן 
    function generateCalendarLink(workshop, attendeeName) {
        // יוצר תאריך התחלה וסיום לאירוע
        const startDate = workshop.date;
        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + 2); // סדנה בת שעתיים
        
        // פורמט תאריכים ל-Google Calendar
        const formatDate = (date) => {
            return date.toISOString().replace(/-|:|\.\d+/g, '');
        };
        
        // פרטי האירוע
        const startDateTime = formatDate(startDate);
        const endDateTime = formatDate(endDate);
        const title = encodeURIComponent(`CXpert AI Workshop: ${workshop.title}`);
        const location = encodeURIComponent('Zoom');
        const details = encodeURIComponent(`This is a confirmation for ${attendeeName}'s registration to ${workshop.title} workshop. Link will be provided closer to the date.`);
        
        // יצירת קישור ל-Google Calendar
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${location}`;
    }
    
    // Show confirmation popup
    function showConfirmationPopup(formData) {
        const popup = document.getElementById('confirmation-popup');
        const workshopName = popup.querySelector('.workshop-name');
        const workshopDate = popup.querySelector('.workshop-date');
        const addToCalendarBtn = popup.querySelector('.add-to-calendar-btn');
        
        // Find the workshop details
        const selectedWorkshop = workshopDates.find(workshop => workshop.value === formData.workshop);
        
        if (selectedWorkshop) {
            // Set workshop name
            workshopName.textContent = formData.workshop;
            
            // Format date based on language
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            workshopDate.textContent = selectedWorkshop.date.toLocaleDateString(
                currentLang === 'he' ? 'he-IL' : 'en-US', 
                options
            );
            
            // Create calendar links
            const calendarUrl = generateCalendarLink(selectedWorkshop, formData.name);
            addToCalendarBtn.href = calendarUrl;
            
            // Show popup
            popup.style.display = 'flex';
        }
        
        // Close popup event listeners
        const closePopup = popup.querySelector('.close-popup');
        const closeBtn = popup.querySelector('.close-btn');
        
        closePopup.addEventListener('click', () => {
            popup.style.display = 'none';
        });
        
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });
        
        // Close when clicking outside
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.style.display = 'none';
            }
        });
    }
}); 