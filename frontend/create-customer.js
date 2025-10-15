// Counter for order forms
let orderCount = 1;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    const addOrderBtn = document.getElementById('addOrderBtn');
    const ordersContainer = document.getElementById('ordersContainer');
    const customerForm = document.getElementById('customerForm');
    const languageSelector = document.getElementById('languageSelector');
    
    // Add event listener for adding new orders
    addOrderBtn.addEventListener('click', addOrderForm);
    
    // Add event listener for form submission
    customerForm.addEventListener('submit', createCustomer);
    
    // Language selector event listener
    languageSelector.addEventListener('change', (e) => {
        const selectedLanguage = e.target.value;
        // In a real application, this would trigger language change
        console.log('Language changed to:', selectedLanguage);
    });
    
    // Set today's date as default for existing order dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('purchaseDate1').value = today;
    document.getElementById('deliveryDate1').value = today;
});

// Function to add a new order form
function addOrderForm() {
    orderCount++;
    
    const orderForm = document.createElement('div');
    orderForm.className = 'order-form';
    orderForm.innerHTML = `
        <h4>Order ${orderCount}</h4>
        <button type="button" class="remove-order-btn" data-order="${orderCount}">Remove</button>
        <div class="form-group">
            <label for="orderId${orderCount}">Order ID:</label>
            <input type="text" id="orderId${orderCount}" name="orderId" required>
        </div>
        
        <div class="form-group">
            <label for="orderItems${orderCount}">Items (comma separated):</label>
            <input type="text" id="orderItems${orderCount}" name="orderItems" placeholder="e.g., Butter Milk, Idli" required>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="purchaseDate${orderCount}">Purchase Date:</label>
                <input type="date" id="purchaseDate${orderCount}" name="purchaseDate" required>
            </div>
            
            <div class="form-group">
                <label for="deliveryDate${orderCount}">Delivery Date:</label>
                <input type="date" id="deliveryDate${orderCount}" name="deliveryDate" required>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label for="amount${orderCount}">Amount (₹):</label>
                <input type="number" id="amount${orderCount}" name="amount" required>
            </div>
            
            <div class="form-group">
                <label for="paymentMode${orderCount}">Payment Mode:</label>
                <select id="paymentMode${orderCount}" name="paymentMode" required>
                    <option value="">Select Payment Mode</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Net Banking">Net Banking</option>
                </select>
            </div>
        </div>
    `;
    
    document.getElementById('ordersContainer').appendChild(orderForm);
    
    // Add event listener to the remove button
    const removeBtn = orderForm.querySelector('.remove-order-btn');
    removeBtn.addEventListener('click', function() {
        removeOrderForm(this.getAttribute('data-order'));
    });
    
    // Set today's date as default for new order dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById(`purchaseDate${orderCount}`).value = today;
    document.getElementById(`deliveryDate${orderCount}`).value = today;
}

// Function to remove an order form
function removeOrderForm(orderNumber) {
    if (orderCount > 1) {
        // Find the order form to remove
        const orderForms = document.querySelectorAll('.order-form');
        for (let form of orderForms) {
            const heading = form.querySelector('h4');
            if (heading && heading.textContent.includes(`Order ${orderNumber}`)) {
                form.remove();
                orderCount--;
                return;
            }
        }
    } else {
        alert('At least one order is required.');
    }
}

// Function to create a customer
async function createCustomer(event) {
    event.preventDefault();
    
    // Collect form data
    const customerData = {
        id: parseInt(document.getElementById('customerId').value),
        name: document.getElementById('customerName').value,
        orders: []
    };
    
    // Collect order data
    for (let i = 1; i <= orderCount; i++) {
        const orderId = document.getElementById(`orderId${i}`)?.value;
        if (!orderId) continue;
        
        const order = {
            id: orderId,
            items: document.getElementById(`orderItems${i}`).value.split(',').map(item => item.trim()),
            purchaseDate: document.getElementById(`purchaseDate${i}`).value,
            deliveryDate: document.getElementById(`deliveryDate${i}`).value,
            amount: parseInt(document.getElementById(`amount${i}`).value),
            paymentMode: document.getElementById(`paymentMode${i}`).value
        };
        
        customerData.orders.push(order);
    }
    
    try {
        // Send customer data to the backend
        const response = await fetch('/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        });
        
        if (response.ok) {
            // Show success message
            alert(`Customer ${customerData.name} created successfully!`);
            
            // Reset form
            document.getElementById('customerForm').reset();
            
            // Reset order forms (keep only the first one)
            const ordersContainer = document.getElementById('ordersContainer');
            while (ordersContainer.children.length > 1) {
                ordersContainer.removeChild(ordersContainer.lastChild);
            }
            orderCount = 1;
            
            // Set today's date for the first order
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('purchaseDate1').value = today;
            document.getElementById('deliveryDate1').value = today;
        } else {
            const errorData = await response.json();
            alert(`Error creating customer: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Error creating customer:', error);
        alert('Error creating customer. Please try again.');
    }
}