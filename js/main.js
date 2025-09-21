// GreenBite - Main JavaScript File
// Common functionality and navigation

// Utility Functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function getFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                navMenu.classList.remove('active');
            }
        });
    }
}

// Newsletter functionality
function initializeNewsletter() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const email = emailInput.value.trim();
            
            if (email) {
                // Save email to localStorage
                const emails = getFromLocalStorage('newsletter-emails', []);
                if (!emails.includes(email)) {
                    emails.push(email);
                    saveToLocalStorage('newsletter-emails', emails);
                }
                
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            }
        });
    }
}




// Home page specific functionality

// Health quotes for home page rotation
const healthQuotes = [
    "Health is not about the weight you lose, but about the life you gain.",
    "Take care of your body. It's the only place you have to live.",
    "A healthy outside starts from the inside.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Health is a state of complete harmony of the body, mind and spirit.",
    "The first wealth is health.",
    "To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.",
    "He who takes medicine and neglects to diet wastes the skill of his doctors.",
    "The greatest revolution of our generation is the discovery that human beings can alter their lives by altering their attitudes of mind.",
    "Healthy citizens are the greatest asset any country can have."
];

// Daily health tips
const dailyTips = [
    "Start your day with a glass of water to kickstart your metabolism.",
    "Take a 10-minute walk after meals to aid digestion.",
    "Practice deep breathing for 5 minutes to reduce stress.",
    "Eat a rainbow of fruits and vegetables for optimal nutrition.",
    "Get 7-9 hours of quality sleep for better health.",
    "Stand up and stretch every hour if you work at a desk.",
    "Choose whole grains over refined grains for sustained energy.",
    "Stay hydrated by drinking water throughout the day.",
    "Practice gratitude to improve mental well-being.",
    "Limit processed foods and cook more meals at home."
];

let currentQuoteIndex = 0;
let quoteInterval;

// Home page functionality
function initializeHomePage() {
    const quoteElement = document.getElementById('quote-text');
    const tipElement = document.getElementById('daily-tip-text');

    if (quoteElement) {
        // Start quote rotation with 3 second interval
        function rotateQuotes() {
            quoteElement.textContent = healthQuotes[currentQuoteIndex];
            currentQuoteIndex = (currentQuoteIndex + 1) % healthQuotes.length;
        }

        rotateQuotes(); // Show first quote immediately
        quoteInterval = setInterval(rotateQuotes, 3000); // Change every 3 seconds
    }

    if (tipElement) {
        // Show daily tip based on date
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const tipIndex = dayOfYear % dailyTips.length;
        tipElement.textContent = dailyTips[tipIndex];
    }
}

// Initialize home page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeHomePage);

// Cleanup intervals when page unloads
window.addEventListener('beforeunload', () => {
    if (quoteInterval) clearInterval(quoteInterval);
});



// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeNewsletter();
});