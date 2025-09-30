// Expense Tracker JavaScript

let transactions = [];

// DOM Elements
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const typeSelect = document.getElementById('type');
const addBtn = document.getElementById('addBtn');
const transactionList = document.getElementById('transactionList');
const balanceAmount = document.getElementById('balanceAmount');
const incomeAmount = document.getElementById('incomeAmount');
const expenseAmount = document.getElementById('expenseAmount');

// Category Emojis
const categoryEmojis = {
    food: '🍔',
    transport: '🚗',
    entertainment: '🎮',
    utilities: '⚡',
    shopping: '🛍️',
    health: '💊',
    other: '📌'
};

// Add Transaction
addBtn.addEventListener('click', addTransaction);

// Allow Enter key to submit
descriptionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTransaction();
});

amountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTransaction();
});

function addTransaction() {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;
    const type = typeSelect.value;

    // Validation
    if (!description || !amount || isNaN(amount) || amount <= 0) {
        showNotification('Please enter valid description and amount', 'error');
        return;
    }

    // Create transaction object
    const transaction = {
        id: Date.now(),
        description,
        amount,
        category,
        type,
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    };

    // Add to transactions array
    transactions.unshift(transaction);

    // Clear inputs
    descriptionInput.value = '';
    amountInput.value = '';

    // Update UI
    updateUI();
    showNotification('Transaction added successfully!', 'success');
}

// Delete Transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateUI();
    showNotification('Transaction deleted', 'info');
}

// Update UI
function updateUI() {
    // Calculate totals
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    // Update stats
    balanceAmount.textContent = `$${balance.toFixed(2)}`;
    incomeAmount.textContent = `$${income.toFixed(2)}`;
    expenseAmount.textContent = `$${expenses.toFixed(2)}`;

    // Update balance color
    if (balance >= 0) {
        balanceAmount.style.color = 'var(--neon-cyan)';
        balanceAmount.style.textShadow = '0 0 20px var(--neon-cyan)';
    } else {
        balanceAmount.style.color = 'var(--neon-pink)';
        balanceAmount.style.textShadow = '0 0 20px var(--neon-pink)';
    }

    // Render transactions
    renderTransactions();
}

// Render Transactions
function renderTransactions() {
    if (transactions.length === 0) {
        transactionList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📊</div>
                <p>No transactions yet</p>
                <p class="empty-subtext">Start tracking your finances above</p>
            </div>
        `;
        return;
    }

    transactionList.innerHTML = transactions.map(t => `
        <div class="transaction-item ${t.type}-transaction">
            <div class="transaction-info">
                <div class="transaction-title">
                    ${categoryEmojis[t.category]} ${t.description}
                </div>
                <div class="transaction-meta">
                    <span>${t.category.charAt(0).toUpperCase() + t.category.slice(1)}</span>
                    <span>•</span>
                    <span>${t.date}</span>
                </div>
            </div>
            <div class="transaction-amount-group">
                <div class="transaction-amount ${t.type}">
                    ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
                </div>
                <button class="btn-delete" onclick="deleteTransaction(${t.id})">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

// Notification System
function showNotification(message, type) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    const colors = {
        success: 'var(--neon-green)',
        error: 'var(--neon-pink)',
        info: 'var(--neon-cyan)'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        color: ${colors[type]};
        padding: 15px 25px;
        border-radius: 10px;
        border: 2px solid ${colors[type]};
        box-shadow: 0 0 30px ${colors[type]}50;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
        letter-spacing: 1px;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize
updateUI();