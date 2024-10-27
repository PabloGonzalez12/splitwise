// Function to switch between pages based on page ID
function displayPage(pageID) {
  // Select all elements with the 'page' class and remove the 'active' class from each
  pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  // Add the 'active' class to the specific page identified by pageID
  document.getElementById(pageID).classList.add('active');
}

// Array to hold user data
let users = [];

// User class to store and manage user information
class User {
  constructor(name, gender, icon) {
    this.name = name;
    this.gender = gender;
    this.icon = icon;
    this.totalPaid = 0;
    this.balance = 0;
  }

  // Method to return pronoun based on gender
  getPronoun() {
    return this.gender === 'male' ? 'he' : 'she';
  }

  // Method to add a payment and update balance accordingly
  addPayment(amount) {
    this.totalPaid += parseFloat(amount);
    this.updateBalance(amount);
  }

  // Method to update balance with a given amount
  updateBalance(amount) {
    this.balance += parseFloat(amount);
  }

  // Method to reset balance to zero
  settleUp() {
    this.balance = 0;
  }
}

// Array to hold expense data
let expenses = [];

// Expense class to store and manage expense information, including validation
class Expense {
  constructor(user, amount, title) {
    this.user = user;
    this.amount = parseFloat(amount);
    this.title = title;
    this.date = new Date(); // Set current date for the expense
  }

  // Method to format the date for display
  getFormattedDate() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      month: months[this.date.getMonth()],
      day: this.date.getDate()
    };
  }
}

// Icons selection in the icons container
const iconsContainer = document.querySelector('.icons');

// Event listener to handle icon selection change
iconsContainer.addEventListener('change', (event) => {
  if (event.target.matches('input[name="icon"]')) {
    iconsContainer.querySelectorAll('img').forEach(img => img.classList.remove('checked'));
    
    // Add 'checked' class to the selected icon
    const selectedImg = event.target.nextElementSibling.querySelector('img');
    selectedImg.classList.add('checked');
  }
});

// Function to validate the user form
function validateUserForm(username, genre, icon) {
  if (!username || username.trim() === '') {
    alert('Please enter a username');
    return false;
  }
  if (!genre) {
    alert('Please select a genre');
    return false;
  }
  if (!icon) {
    alert('Please select an icon');
    return false;
  }
  return true;
}

// Function to update the users list in the UI
function updateUsersList() {
  const usersMain = document.querySelector('.users-main');
  usersMain.innerHTML = '';

  users.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.className = 'user';
    userDiv.innerHTML = `
      <div>
        <img src="${user.icon}" alt="${user.name}">
      </div>
      <div>
        <span>${user.name}</span>
      </div>
    `;
    usersMain.appendChild(userDiv);
  });

  // Update user dropdown menu in the add-expense form
  const selectUser = document.getElementById('selectUser');
  selectUser.innerHTML = '<option value="Select" selected disabled>Select</option>';
  users.forEach(user => {
    const option = document.createElement('option');
    option.value = user.name;
    option.textContent = user.name;
    selectUser.appendChild(option);
  });
}

// Confirm expense button element
const confirmExpenseElement = document.getElementById('confirmExpense');

// Event listener for adding a user when 'confirmExpense' is clicked
confirmExpenseElement.addEventListener('click', function (event) {
  event.preventDefault();

  // Get user form values
  let username = document.getElementById('username').value;
  let genre = document.querySelector('input[name="genre"]:checked').value;
  let inputIcon = document.querySelector('input[name="icon"]:checked');
  let iconSrc = inputIcon.closest('div').querySelector('img').src;

  // Validate user form and stop if invalid
  if (!validateUserForm(username, genre, iconSrc)) {
    return;
  }

  // Add new user to users array
  const newUser = new User(username, genre, iconSrc);
  users.push(newUser);

  // Update the users list in the UI
  updateUsersList();

  // Clear the username input
  document.getElementById('username').value = '';
});

// Expense form elements
const expenseForm = document.querySelector('#add-expense');
const selectUser = document.getElementById('selectUser');
const amountInput = document.getElementById('amountExpense');
const titleInput = document.getElementById('amountTitle');

// Function to update the expenses list in the UI
function updateExpensesList() {
  const paidsMain = document.querySelector('.paids-main');
  paidsMain.innerHTML = '';

  expenses.forEach(expense => {
    const date = expense.getFormattedDate();
    const user = users.find(u => u.name === expense.user);
    
    const expenseDiv = document.createElement('div');
    expenseDiv.className = 'paid';
    expenseDiv.innerHTML = `
      <div>
        <span>${date.month}</span>
        <span>${date.day}</span>
      </div>
      <div>
        <img src="${user.icon}" alt="${user.name}">
      </div>
      <div>
        <span>${expense.title}</span>
        <span>${user.name} paid ${expense.amount}€</span>
      </div>
    `;
    paidsMain.appendChild(expenseDiv);
  });
}

// Function to handle adding an expense
function addExpense() {
  // Get form values
  const selectedUser = selectUser.value;
  const amount = amountInput.value;
  const title = titleInput.value.trim().replace(/\s+/g, ' ');

  // Validate user selection
  if (selectedUser === 'Select') {
    alert('Please select a user');
    return;
  }

  // Create and add new expense
  const expense = new Expense(selectedUser, amount, title);
  expenses.push(expense);

  // Update user's balance
  const user = users.find(u => u.name === selectedUser);
  if (user) {
    user.addPayment(amount);
  }

  // Update UI
  updateExpensesList();
  
  // Clear form
  selectUser.value = 'Select';
  amountInput.value = '';
  titleInput.value = '';

  updateBalancesList();
}

// Add event listener for expense form submission
document.querySelector('#add-expense button[type="submit"]').addEventListener('click', addExpense);

// Calculate the average amount each person should pay
function calculateAveragePerPerson() {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  return users.length > 0 ? totalExpenses / users.length : 0;
}

// Update balances display in the UI
function updateBalancesList() {
  const balancesMain = document.querySelector('.balances-main');
  balancesMain.innerHTML = '';
  
  const averagePerPerson = calculateAveragePerPerson();
  
  users.forEach(user => {
    // Calculate balance for each user
    const userBalance = user.totalPaid - averagePerPerson;
    
    const balanceDiv = document.createElement('div');
    balanceDiv.className = 'balance';
    
    // Determine pronoun based on gender
    const pronoun = user.getPronoun();
    
    balanceDiv.innerHTML = `
      <div>
        <img src="${user.icon}" alt="${user.name}">
      </div>
      <div>
        <div>${user.name}</div>
        <div>${pronoun} has paid ${user.totalPaid.toFixed(2)}€</div>
        <div>${pronoun} is owed ${Math.max(userBalance, 0).toFixed(2)}€</div>
      </div>
    `;
    
    balancesMain.appendChild(balanceDiv);
  });
}

// Function to reset balances temporarily to display 0 balance on the balances page
function settleUp() {
  // Save current total paid values for each user
  const userTotals = {};
  users.forEach(user => {
    userTotals[user.name] = user.totalPaid;
  });
  
  // Temporarily set totalPaid to 0 to show zero balances
  users.forEach(user => {
    user.totalPaid = 0;
  });
  
  // Update balances display to show zero balances
  updateBalancesList();
  
  // Restore the original totalPaid values
  users.forEach(user => {
    user.totalPaid = userTotals[user.name];
  });
}

// Add event listener for settle up button
document.getElementById('settleUp').addEventListener('click', settleUp);

// Update balances list when switching to the balances page
function displayPage(pageID) {
  pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  document.getElementById(pageID).classList.add('active');
  
  // Update balances if navigating to the balances page
  if (pageID === 'balances') {
    updateBalancesList();
  }
}