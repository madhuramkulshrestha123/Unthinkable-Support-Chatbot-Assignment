const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Google Generative AI
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (if needed in future)
// const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// In-memory storage for sessions and FAQs
let sessions = {};
let faqs = [
  {
    id: 1,
    question: "What are your delivery hours?",
    answer: "We deliver from 9 AM to 8 PM, Monday through Sunday."
  },
  {
    id: 2,
    question: "How can I track my order?",
    answer: "You can track your order status in the 'My Orders' section of our app or website."
  },
  {
    id: 3,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, UPI, and digital wallets like PayPal."
  },
  {
    id: 4,
    question: "How do I cancel my order?",
    answer: "You can cancel your order from the 'My Orders' section before it's out for delivery."
  }
];

// Sample customer data
const customers = [
  {
    id: 1,
    name: "Shubhi Gahoi",
    orders: [
      {
        id: "ORD-001",
        items: ["Butter Milk", "Idli"],
        purchaseDate: "2025-10-10",
        deliveryDate: "2025-10-10",
        amount: 120,
        paymentMode: "Credit Card"
      },
      {
        id: "ORD-005",
        items: ["Dosa", "Chutney", "Filter Coffee"],
        purchaseDate: "2025-10-12",
        deliveryDate: "2025-10-12",
        amount: 250,
        paymentMode: "UPI"
      }
    ]
  },
  {
    id: 2,
    name: "Piyush Sayaji Torawane",
    orders: [
      {
        id: "ORD-002",
        items: ["Masala Dosa", "Sambar", "Filter Coffee"],
        purchaseDate: "2025-10-08",
        deliveryDate: "2025-10-08",
        amount: 180,
        paymentMode: "Debit Card"
      }
    ]
  },
  {
    id: 3,
    name: "Karan Singh",
    orders: [
      {
        id: "ORD-003",
        items: ["Pongal", "Vada", "Coconut Chutney"],
        purchaseDate: "2025-10-05",
        deliveryDate: "2025-10-05",
        amount: 150,
        paymentMode: "Cash on Delivery"
      },
      {
        id: "ORD-004",
        items: ["Poori", "Potato Curry", "Filter Coffee"],
        purchaseDate: "2025-10-11",
        deliveryDate: "2025-10-11",
        amount: 200,
        paymentMode: "UPI"
      }
    ]
  }
];

// Language dictionaries for fallback responses
const translations = {
    en: {
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

// Function to get translation for a key and language
function t(key, language = 'en') {
    return translations[language] && translations[language][key] ? translations[language][key] : translations['en'][key];
}

// Routes

// Get all customers
app.get('/api/customers', (req, res) => {
  res.json(customers);
});

// Get a specific customer by ID
app.get('/api/customers/:id', (req, res) => {
  const customer = customers.find(c => c.id === parseInt(req.params.id));
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  res.json(customer);
});

// Create a new customer
app.post('/api/customers', (req, res) => {
  const { id, name, orders } = req.body;
  
  // Validate required fields
  if (!id || !name) {
    return res.status(400).json({ error: 'Customer ID and name are required' });
  }
  
  // Check if customer with this ID already exists
  const existingCustomer = customers.find(c => c.id === id);
  if (existingCustomer) {
    return res.status(400).json({ error: 'Customer with this ID already exists' });
  }
  
  // Create new customer object
  const newCustomer = {
    id,
    name,
    orders: orders || []
  };
  
  // Add to customers array
  customers.push(newCustomer);
  
  // Return the created customer
  res.status(201).json(newCustomer);
});

// Get all FAQs
app.get('/api/faqs', (req, res) => {
  res.json(faqs);
});

// Create a new chat session
app.post('/api/sessions', (req, res) => {
    const { customerId, language = 'en' } = req.body; // Accept language parameter
    const sessionId = Date.now().toString();
    
    sessions[sessionId] = {
        id: sessionId,
        customerId: customerId,
        language: language, // Store language preference
        messages: [],
        createdAt: new Date()
    };
    
    res.json({ sessionId });
});

// Get chat history for a session
app.get('/api/sessions/:sessionId', (req, res) => {
  const session = sessions[req.params.sessionId];
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session);
});

// Function to generate AI response using Gemini
async function generateAIResponse(customer, message, conversationHistory, language = 'en') {
  try {
    // Create a prompt that includes customer context
    let prompt = `You are a customer support agent for a food delivery service. 
    Please respond to the customer's query based on their order history and context.
    
    Customer Name: ${customer.name}
    
    Order History:
    ${customer.orders.map(order => `
    - Order ID: ${order.id}
      Items: ${order.items.join(', ')}
      Purchase Date: ${order.purchaseDate}
      Delivery Date: ${order.deliveryDate}
      Amount: ₹${order.amount}
      Payment Mode: ${order.paymentMode}
    `).join('')}
    
    Conversation History:
    ${conversationHistory.map(msg => `${msg.sender}: ${msg.text}`).join('\n')}
    
    Current Query: ${message}
    
    Please provide a helpful and personalized response based on the customer's context. 
    Keep your response brief, clear, and in simple language that is easy to understand.
    Use short sentences and avoid complex words or technical jargon.
    Limit your response to 2-3 short paragraphs maximum.
    
    IMPORTANT: The user prefers to communicate in ${language === 'hi' ? 'Hindi' : 'English'}. 
    Please respond in ${language === 'hi' ? 'Hindi' : 'English'}.`;

    console.log('Attempting to call Gemini API with model: gemini-2.0-flash');
    console.log('Prompt length:', prompt.length);

    // Initialize the model with the correct model name format
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Successfully received response from Gemini API');
    return text;
  } catch (error) {
    console.error('Error generating AI response:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    // Fallback to the original logic if Gemini fails
    return null;
  }
}

// Send a message in a chat session
app.post('/api/sessions/:sessionId/messages', async (req, res) => {
  const session = sessions[req.params.sessionId];
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  const { message, sender, language = 'en' } = req.body; // Accept language parameter
  
  // Update session language if provided
  if (language) {
    session.language = language;
  }
  
  // Add user message to session
  const userMessage = {
    id: Date.now().toString(),
    text: message,
    sender: sender,
    timestamp: new Date()
  };
  
  session.messages.push(userMessage);
  
  // Get customer information for contextual responses
  const customer = customers.find(c => c.id === session.customerId);
  const customerName = customer ? customer.name : 'customer';
  const orderHistory = customer ? customer.orders : [];
  
  // Try to generate AI response using Gemini with language preference
  let responseText = await generateAIResponse(customer, message, session.messages, session.language);
  
  // If Gemini fails, fall back to the original logic with translations
  if (!responseText) {
    const lang = session.language || 'en';
    const lowerMessage = message.toLowerCase();
    const matchedFAQ = faqs.find(faq => 
      lowerMessage.includes(faq.question.toLowerCase().split(' ')[0]) ||
      faq.question.toLowerCase().includes(lowerMessage.split(' ')[0])
    );
    
    if (matchedFAQ) {
      responseText = matchedFAQ.answer;
    } else if (lowerMessage.includes('order') || lowerMessage.includes('delivery')) {
      if (orderHistory.length > 0) {
        // Provide context about their recent orders
        const recentOrder = orderHistory[orderHistory.length - 1];
        responseText = `${t('recentOrder', lang)} ${orderHistory.length} ${t('order_s', lang)}. ${t('recentOrder', lang)} (${recentOrder.id}) ${t('included', lang)} ${recentOrder.items.join(', ')} ${t('deliveredOn', lang)} ${recentOrder.deliveryDate}. ${t('helpWithOrder', lang)}`;
      } else {
        responseText = t('orderDeliveryHelp', lang);
      }
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('refund')) {
      if (orderHistory.length > 0) {
        const recentOrder = orderHistory[orderHistory.length - 1];
        responseText = `${t('recentOrder', lang)} (${recentOrder.id}) ${t('paymentWith', lang)} ${recentOrder.paymentMode}. ${t('paymentIssues', lang)}`;
      } else {
        responseText = t('paymentIssues', lang);
      }
    } else if (lowerMessage.includes('cancel')) {
      responseText = t('cancelOrder', lang);
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      if (orderHistory.length > 0) {
        responseText = `${t('hello', lang)} ${customerName}! ${t('totalOrders', lang)} ${orderHistory.length} ${t('order_s', lang)}. ${t('howCanIHelp', lang)}`;
      } else {
        responseText = `${t('hello', lang)} ${customerName}! ${t('howCanIHelp', lang)}`;
      }
    } else if (lowerMessage.includes('thank')) {
      responseText = t('thankYou', lang);
    } else if (lowerMessage.includes('total') && lowerMessage.includes('amount') || lowerMessage.includes('spent')) {
      // Calculate total amount spent
      const totalSpent = orderHistory.reduce((sum, order) => sum + order.amount, 0);
      responseText = `${t('spent', lang)} ₹${totalSpent} ${t('on', lang)} ${orderHistory.length} ${t('order_s', lang)}. ${t('recentOrderFor', lang)} (${orderHistory[orderHistory.length - 1].id}) ${t('wasFor', lang)} ₹${orderHistory[orderHistory.length - 1].amount}.`;
    } else {
      // Escalation scenario
      responseText = t('notSure', lang);
    }
  }
  
  // Add AI response to session
  const aiMessage = {
    id: (Date.now() + 1).toString(),
    text: responseText,
    sender: 'AI',
    timestamp: new Date()
  };
  
  session.messages.push(aiMessage);
  
  res.json({
    userMessage,
    aiMessage
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});