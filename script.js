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
        
        if (!isValid) {
            e.preventDefault();
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
}); 