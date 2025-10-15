// Working Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Add any interactive functionality for Working page here
    console.log('Working page loaded');
    
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