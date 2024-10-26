function displayPage(pageID) {
  pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  document.getElementById(pageID).classList.add('active');
}

document.getElementById('myForm').addEventListener('submit', function (event) {
  event.preventDefault();

  let genre = document.querySelector('input[name="genre"]:checked').value;
  let name = document.getElementById('name').value;

  console.log('Selected genre:', genre);
  console.log('Name:', name);
});




// User class
class User {
  constructor(name, gender, icon) {
    this.name = name;
    this.gender = gender;
    this.icon = icon;
    this.totalPaid = 0;
    this.balance = 0;
  }

  getPronoun() {
    return this.gender === 'male' ? 'he' : 'she';
  }

  addPayment(amount) {
    this.totalPaid += parseFloat(amount);
    this.updateBalance(amount);
  }

  updateBalance(amount) {
    this.balance += parseFloat(amount);
  }

  settleUp() {
    this.balance = 0;
  }
}

// Expense class
class Expense {
  constructor(user, amount, title) {
    this.user = user;
    this.amount = parseFloat(amount);
    this.title = title;
    this.date = new Date();
  }

  getFormattedDate() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      month: months[this.date.getMonth()],
      day: this.date.getDate()
    };
  }
}



const usernameElement = document.getElementById('username');