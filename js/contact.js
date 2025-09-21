// Contact page functionality

function initializeContactPage() {
    const contactForm = document.getElementById('contact-form');
    const faqItems = document.querySelectorAll('.faq-item');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            
            // Simple validation
            let isValid = true;
            
            if (!name) {
                showError('name-error', 'Name is required');
                isValid = false;
            }
            
            if (!email || !isValidEmail(email)) {
                showError('email-error', 'Valid email is required');
                isValid = false;
            }
            
            if (!message) {
                showError('message-error', 'Message is required');
                isValid = false;
            }
            
            if (isValid) {
                // Save feedback to localStorage
                const feedback = getFromLocalStorage('contact-feedback', []);
                feedback.push({
                    name,
                    email,
                    message,
                    date: new Date().toISOString()
                });
                saveToLocalStorage('contact-feedback', feedback);
                
                // Show success message
                document.getElementById('form-success').style.display = 'block';
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    document.getElementById('form-success').style.display = 'none';
                }, 5000);
            }
        });
    }

    // FAQ accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');

        if (question && answer && toggle) {
            question.addEventListener('click', () => {
                const isActive = answer.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.querySelector('.faq-answer').classList.remove('active');
                    otherItem.querySelector('.faq-toggle').classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    answer.classList.add('active');
                    toggle.classList.add('active');
                }
            });
        }
    });
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize contact page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeContactPage);