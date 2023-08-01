let bearerToken = null;

// Function to handle login form submission
document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const loginId = document.getElementById('login_id').value;
  const password = document.getElementById('password').value;

  fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp', {
    method: 'POST',
    body: JSON.stringify({ login_id: loginId, password: password }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Invalid login credentials.');
    }
  })
  .then(data => {
    bearerToken = data.token;
    showCustomerListScreen();
  })
  .catch(error => {
    alert(error.message);
  });
});

// Function to show the customer list screen
function showCustomerListScreen() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('customerListScreen').style.display = 'block';
  getCustomerList();
}

// Function to get the customer list
function getCustomerList() {
  fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${bearerToken}` }
  })
  .then(response => response.json())
  .then(data => {
    displayCustomerList(data);
  })
  .catch(error => {
    alert(error.message);
  });
}

// Function to display the customer list
function displayCustomerList(customers) {
  const tableBody = document.getElementById('customerTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = '';

  customers.forEach(customer => {
    const row = tableBody.insertRow();
    for (const key in customer) {
      const cell = row.insertCell();
      cell.innerHTML = customer[key];
    }
  });
}

// Function to show the create/update customer screen
function showCreateCustomerScreen() {
  document.getElementById('customerListScreen').style.display = 'none';
  document.getElementById('createUpdateCustomerScreen').style.display = 'block';
}

// Function to handle create/update customer form submission
document.getElementById('customerForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const cmd = (document.getElementById('first_name').value && document.getElementById('last_name').value) ? 'create' : 'update';
  const customerData = {
    cmd,
    first_name: document.getElementById('first_name').value,
    last_name: document.getElementById('last_name').value,
    street: document.getElementById('street').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value
  };

  fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp', {
    method: 'POST',
    body: JSON.stringify(customerData),
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bearerToken}` }
  })
  .then(response => {
    if (response.ok) {
      showCustomerListScreen();
    } else {
      throw new Error('Failed to create/update customer.');
    }
  })
  .catch(error => {
    alert(error.message);
  });
});

// Function to cancel create/update and return to the customer list screen
function cancelCreateUpdate() {
  document.getElementById('customerForm').reset();
  document.getElementById('customerListScreen').style.display = 'block';
  document.getElementById('createUpdateCustomerScreen').style.display = 'none';
}

// Function to handle logout and return to the login screen
document.getElementById('logoutBtn').addEventListener('click', function () {
  bearerToken = null;
  document.getElementById('customerListScreen').style.display = 'none';
  document.getElementById('createUpdateCustomerScreen').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'block';
});
