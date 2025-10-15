// FAQ Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Add any interactive functionality for FAQ page here
    console.log('FAQ page loaded');
    
    // Add click functionality to FAQ cards to expand/collapse answers
    const faqCards = document.querySelectorAll('.faq-card');
    
    faqCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
    
    // Language selector event listener
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.addEventListener('change', (e) => {
            const selectedLanguage = e.target.value;
            // In a real application, this would trigger language change
            console.log('Language changed to:', selectedLanguage);
        });
    }
});