// API base URL - Using relative path for proxy
// const API_BASE = '/api';

// Load configuration
let config;
try {
  // Try to load the config file
  config = window.config || { API_BASE: '/api' };
} catch (e) {
  // Fallback to default if config not available
  config = { API_BASE: '/api' };
}

const API_BASE = config.API_BASE;

// Global variables
let currentSessionId = null;
let currentCustomerId = null;
let currentCustomer = null;
let currentLanguage = 'en'; // Default language is English

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const customersGrid = document.getElementById('customersGrid');
const endChatButton = document.getElementById('endChatButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const languageSelector = document.getElementById('languageSelector');
const chatSuggestions = document.getElementById('chatSuggestions');

// Language dictionaries
const translations = {
    en: {
        welcomeMessage: "Welcome to Unthinkable's Support Chatbot where you can get all your support demands answer, choose a customer to get your Queries Resolved...",
        selectCustomer: "Select a customer to start chatting...",
        typeMessage: "Type your message...",
        chatSessionExited: "Chat session exited. Please select a customer from the left panel to start a new chat.",
        startingChat: "Starting chat...",
        exitButton: "Exit",
        exiting: "Exiting...",
        sendButton: "Send",
        orderHistory: "Order History",
        chatButton: "Chat",
        orders: "orders",
        hello: "Hello",
        howCanIHelp: "How can I help you today?",
        recentOrder: "Your recent order",
        included: "included",
        deliveredOn: "and was delivered on",
        totalOrders: "You have",
        order_s: "order(s)",
        spent: "You've spent",
        on: "on",
        recentOrderFor: "Your recent order",
        wasFor: "was for",
        paymentWith: "was paid with",
        paymentIssues: "For payment issues, contact our billing team for help.",
        cancelOrder: "To cancel an order, go to 'My Orders' in our app or website.",
        thankYou: "You're welcome! Need help with anything else?",
        notSure: "I'm not sure about that. Let me connect you with a human agent who can help better.",
        orderDeliveryHelp: "I can help with order and delivery questions. Could you share your order ID?",
        helpWithOrder: "What do you need help with?"
    },
    hi: {
        welcomeMessage: "असंख्य ग्राहक सहायता चैटबॉट में आपका स्वागत है जहां आपके सभी सहायता प्रश्नों के उत्तर प्राप्त कर सकते हैं, अपने प्रश्नों को हल करने के लिए एक ग्राहक का चयन करें...",
        selectCustomer: "चैटिंग शुरू करने के लिए एक ग्राहक का चयन करें...",
        typeMessage: "अपना संदेश टाइप करें...",
        chatSessionExited: "चैट सत्र समाप्त हो गया। एक नया चैट शुरू करने के लिए बाईं ओर से एक ग्राहक का चयन करें।",
        startingChat: "चैट शुरू हो रही है...",
        exitButton: "बाहर निकलें",
        exiting: "बाहर निकल रहे हैं...",
        sendButton: "भेजें",
        orderHistory: "आदेश इतिहास",
        chatButton: "चैट करें",
        orders: "आदेश",
        hello: "नमस्ते",
        howCanIHelp: "मैं आज आपकी कैसे मदद कर सकता हूँ?",
        recentOrder: "आपका हाल का आदेश",
        included: "में शामिल था",
        deliveredOn: "और को डिलीवर किया गया था",
        totalOrders: "आपके पास",
        order_s: "आदेश",
        spent: "आपने खर्च किया",
        on: "पर",
        recentOrderFor: "आपका हाल का आदेश",
        wasFor: "था",
        paymentWith: "के साथ भुगतान किया गया था",
        paymentIssues: "भुगतान समस्याओं के लिए, हमारी बिलिंग टीम से सहायता लें।",
        cancelOrder: "आदेश रद्द करने के लिए, हमारे ऐप या वेबसाइट में 'मेरे आदेश' पर जाएं।",
        thankYou: "आपका स्वागत है! क्या आपको कुछ और मदद की आवश्यकता है?",
        notSure: "मुझे इसके बारे में यकीन नहीं है। मुझे आपकी बेहतर मदद के लिए एक मानव एजेंट से जोड़ें।",
        orderDeliveryHelp: "मैं आदेश और डिलीवरी प्रश्नों में मदद कर सकता हूँ। क्या आप अपना आदेश आईडी साझा कर सकते हैं?",
        helpWithOrder: "आपको किस चीज़ में मदद की आवश्यकता है?"
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadCustomers();
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    endChatButton.addEventListener('click', endChat);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Language selector event listener
    languageSelector.addEventListener('change', (e) => {
        const selectedLanguage = e.target.value;
        changeLanguage(selectedLanguage);
    });
    
    // Add event listeners to suggestion buttons
    document.querySelectorAll('.suggestion-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const suggestion = e.target.getAttribute('data-suggestion');
            if (messageInput.disabled === false) {
                messageInput.value = suggestion;
                sendMessage();
            }
        });
    });
    
    // Refresh customers every 10 seconds to show newly created customers
    setInterval(loadCustomers, 10000);
});

// Function to change language
function changeLanguage(language) {
    currentLanguage = language;
    
    // Update UI elements based on selected language
    updateUITranslations();
    
    // If there's an active chat session, inform the backend about language change
    if (currentSessionId) {
        // In a real implementation, you would send this to the backend
        console.log('Language changed to:', language);
    }
}

// Function to update UI translations
function updateUITranslations() {
    const t = translations[currentLanguage];
    
    // Update placeholders and button texts
    if (messageInput.disabled) {
        messageInput.placeholder = t.selectCustomer;
    } else {
        messageInput.placeholder = t.typeMessage;
    }
    
    sendButton.textContent = t.sendButton;
    
    // Update end chat button if visible
    if (endChatButton.style.display !== 'none') {
        endChatButton.textContent = t.exitButton;
    }
    
    // Update chat suggestions
    updateSuggestionTranslations();
}

// Function to update suggestion translations
function updateSuggestionTranslations() {
    const suggestions = [
        { en: "When will my order arrive?", hi: "मेरा ऑर्डर कब आएगा?" },
        { en: "Payment errors", hi: "भुगतान त्रुटियाँ" },
        { en: "Return queries", hi: "वापसी प्रश्न" },
        { en: "Order status", hi: "ऑर्डर की स्थिति" },
        { en: "Refund process", hi: "धनवापसी प्रक्रिया" },
        { en: "Delivery issues", hi: "डिलीवरी समस्याएँ" }
    ];
    
    const suggestionButtons = document.querySelectorAll('.suggestion-button');
    suggestionButtons.forEach((button, index) => {
        if (index < suggestions.length) {
            button.textContent = suggestions[index][currentLanguage];
            button.setAttribute('data-suggestion', suggestions[index][currentLanguage]);
        }
    });
}

// Load customers from the API
async function loadCustomers() {
    try {
        const response = await fetch(`${API_BASE}/customers`);
        const customers = await response.json();
        
        // Clear the grid
        customersGrid.innerHTML = '';
        
        // Create customer cards
        customers.forEach(customer => {
            const t = translations[currentLanguage];
            const card = document.createElement('div');
            card.className = 'customer-card';
            card.innerHTML = `
                <h3>${customer.name}</h3>
                <div class="customer-info">
                    <p><strong>ID:</strong> ${customer.id}</p>
                    <div class="order-history">
                        <h4>${t.orderHistory} (${customer.orders.length} ${t.orders})</h4>
                        ${customer.orders.map(order => `
                            <div class="order-item">
                                <p><strong>${order.id}</strong> - ${order.items.join(', ')}</p>
                                <p>${t.orderHistory}: ${order.purchaseDate} | ${t.deliveredOn}: ${order.deliveryDate}</p>
                                <p>${t.spent}: ₹${order.amount} | ${t.paymentWith}: ${order.paymentMode}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <button class="chat-button" data-customer-id="${customer.id}">${t.chatButton}</button>
            `;
            customersGrid.appendChild(card);
        });
        
        // Add event listeners to chat buttons
        document.querySelectorAll('.chat-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const customerId = parseInt(e.target.getAttribute('data-customer-id'));
                startChat(customerId);
            });
        });
    } catch (error) {
        console.error('Error loading customers:', error);
        customersGrid.innerHTML = '<p>Error loading customer data. Please try again.</p>';
    }
}

// Start a chat session with a customer
async function startChat(customerId) {
    try {
        const t = translations[currentLanguage];
        
        // Show loading state on the chat button
        const chatButton = document.querySelector(`.chat-button[data-customer-id="${customerId}"]`);
        const originalText = chatButton.textContent;
        chatButton.textContent = t.startingChat;
        chatButton.disabled = true;
        
        // Get customer details
        const customerResponse = await fetch(`${API_BASE}/customers/${customerId}`);
        currentCustomer = await customerResponse.json();
        
        // Create chat session
        const response = await fetch(`${API_BASE}/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customerId, language: currentLanguage }) // Send language preference
        });
        
        const data = await response.json();
        currentSessionId = data.sessionId;
        currentCustomerId = customerId;
        
        // Reset chat button
        chatButton.textContent = originalText;
        chatButton.disabled = false;
        
        // Update chat header with customer info
        const chatHeader = document.querySelector('.chat-header h2');
        chatHeader.textContent = `Support Chat - ${currentCustomer.name}`;
        
        // Show end chat button
        endChatButton.style.display = 'block';
        endChatButton.textContent = t.exitButton;
        
        // Enable chat input
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.placeholder = t.typeMessage;
        messageInput.focus();
        
        // Clear chat messages
        chatMessages.innerHTML = '';
        
        // Show chat suggestions
        chatSuggestions.style.display = 'block';
        
        // Add personalized welcome message
        if (currentCustomer.orders.length > 0) {
            const recentOrder = currentCustomer.orders[currentCustomer.orders.length - 1];
            addMessage('AI', `${t.hello} ${currentCustomer.name}! ${t.totalOrders} ${currentCustomer.orders.length} ${t.order_s}. ${t.recentOrder} (${recentOrder.id}) ${t.included} ${recentOrder.items.join(', ')} ${t.deliveredOn} ${recentOrder.deliveryDate}. ${t.howCanIHelp}`);
        } else {
            addMessage('AI', `${t.hello} ${currentCustomer.name}! ${t.howCanIHelp}`);
        }
    } catch (error) {
        console.error('Error starting chat session:', error);
        addMessage('AI', 'Sorry, I\'m having trouble connecting. Please try again.');
        
        // Reset chat button in case of error
        const chatButton = document.querySelector(`.chat-button[data-customer-id="${customerId}"]`);
        if (chatButton) {
            chatButton.disabled = false;
            chatButton.textContent = translations[currentLanguage].chatButton;
        }
    }
}

// End the chat session
function endChat() {
    const t = translations[currentLanguage];
    
    // Add visual feedback when clicking the exit button
    endChatButton.textContent = t.exiting;
    endChatButton.disabled = true;
    
    // Small delay to show the visual feedback
    setTimeout(() => {
        // Hide end chat button
        endChatButton.style.display = 'none';
        endChatButton.textContent = t.exitButton;
        endChatButton.disabled = false;
        
        // Disable chat input
        messageInput.disabled = true;
        sendButton.disabled = true;
        messageInput.placeholder = t.selectCustomer;
        
        // Reset chat header
        const chatHeader = document.querySelector('.chat-header h2');
        chatHeader.textContent = 'Support Chat';
        
        // Clear chat messages and show welcome message
        chatMessages.innerHTML = `
            <div class="message ai-message">
                <div class="message-content">
                    <p>${t.chatSessionExited}</p>
                </div>
            </div>
        `;
        
        // Hide chat suggestions
        chatSuggestions.style.display = 'none';
        
        // Reset global variables
        currentSessionId = null;
        currentCustomerId = null;
        currentCustomer = null;
    }, 300);
}

// Send a message to the chat
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || !currentSessionId) return;
    
    // Add user message to UI
    addMessage('user', message);
    
    // Clear input
    messageInput.value = '';
    
    // Show loading indicator
    showLoadingIndicator();
    
    try {
        const response = await fetch(`${API_BASE}/sessions/${currentSessionId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                sender: 'user',
                language: currentLanguage // Send language preference
            })
        });
        
        // Hide loading indicator
        hideLoadingIndicator();
        
        const data = await response.json();
        
        // Add AI response to UI
        addMessage('AI', data.aiMessage.text);
        
        // Show suggestions after AI response
        chatSuggestions.style.display = 'block';
    } catch (error) {
        console.error('Error sending message:', error);
        // Hide loading indicator
        hideLoadingIndicator();
        addMessage('AI', 'Sorry, I encountered an error processing your request. Please try again.');
    }
}

// Add a message to the chat UI
function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender.toLowerCase()}-message`;
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
            <small>${timestamp}</small>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show loading indicator
function showLoadingIndicator() {
    loadingIndicator.style.display = 'block';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide loading indicator
function hideLoadingIndicator() {
    loadingIndicator.style.display = 'none';
}

// Initialize with default language
updateUITranslations();