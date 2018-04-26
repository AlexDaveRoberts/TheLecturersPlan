/* Register JS */

/* Event listeners */

/* Accessibility Keyboard Shortcuts */

function keyboardShortcuts(event) {
  // Ctrl N to focus on the name field
  if (event.ctrlKey && event.keyCode == 78) {
    nameInput.focus();
  }

  // Ctrl E to focus on the email field
  if (event.ctrlKey && event.keyCode == 69) {
    emailInput.focus();
  }

  // Ctrl P to focus on the password field
  if (event.ctrlKey && event.keyCode == 80) {
    passwordInput.focus();
  }

  // Ctrl U to focus on the unit field
  if (event.ctrlKey && event.keyCode == 85) {
    unitInput.focus();
  }

  // Ctrl W to focus on the number of weeks field
  if (event.ctrlKey && event.keyCode == 87) {
    weeksInput.focus();
  }

  // Ctrl L to trigger the login function
  if (event.ctrlKey && event.keyCode == 82) {
    register();
  }

  // Ctrl L to redirect to the Login page
  if (event.ctrlKey && event.keyCode == 76) {
    window.location.href = '../';
  }
}

document.addEventListener('keyup', keyboardShortcuts);

// Add event handler for registerSubmit to the register function
registerSubmit.addEventListener('click', register);

// Hide all validation elements on load
let validation = document.getElementsByClassName('validation');
let inputs = document.getElementsByClassName('input');

for (let validate of validation) {
  validate.style.display = 'none';
}

// resetEvents function, resets the event listeners
function resetEvents() {
  for (let input of inputs) {
    input.addEventListener('click', resetForm);
    input.addEventListener('focus', resetForm);
  }
}

// resetForm function, resets the styling on the validation and input elements
function resetForm() {
  for (let validate of validation) {
    validate.style.display = 'none';
  }

  for (let input of inputs) {
    input.style.border = '0.1em solid #000';
  }

  invalidRegister.style.height = '0em';
  invalidRegister.textContent = '';
}

// Register function
async function register() {
  // Valid variable used to determine if form is valid on submission
  let valid = true;
  // Call to resetEvents function
  resetEvents();

  // Checks to see if a name has been entered
  if (nameInput.value == '') {
    nameValidation.textContent = '* Your name is required';
    nameValidation.style.display = 'block';
    nameInput.style.border = '0.1em solid #FF0000';
    valid = false;
  }

  let validEmail = /^([a-zA-Z0-9\_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  // Checks for valid email
  if (!validEmail.test(emailInput.value)) {
    emailValidation.textContent = '* Your email is invalid';
    emailValidation.style.display = 'block';
    emailInput.style.border = '0.1em solid #FF0000';
    valid = false;
  }

  // Checks to see if a password has been entered
  if (passwordInput.value == '') {
    passwordValidation.textContent = '* A password is required';
    passwordValidation.style.display = 'block';
    passwordInput.style.border = '0.1em solid #FF0000';
    valid = false;
  }

  // Checks to see if a unit name has been entered
  if (unitInput.value == '') {
    unitValidation.textContent = '* A unit name is required';
    unitValidation.style.display = 'block';
    unitInput.style.border = '0.1em solid #FF0000';
    valid = false;
  }

  // Checks to see if the number of weeks has been entered
  if (weeksInput.value == '') {
    weeksValidation.textContent = '* Number of weeks is required';
    weeksValidation.style.display = 'block';
    weeksInput.style.border = '0.1em solid #FF0000';
    valid = false;
    // Checks to see if the number of weeks is a number
  } else if (isNaN(weeksInput.value)) {
    weeksValidation.textContent = '* Value entered is not a number';
    weeksValidation.style.display = 'block';
    weeksInput.style.border = '0.1em solid #FF0000';
    valid = false;
  // Checks to see if the number of weeks is outside the range
} else if (weeksInput.value <= 0 || weeksInput.value > 24) {
    weeksValidation.textContent = '* Value needed between 1 and 24';
    weeksValidation.style.display = 'block';
    weeksInput.style.border = '0.1em solid #FF0000';
    valid = false;
  }

  // If valid, send data to server
  if (valid) {
    const url = '/api/register?name=' + encodeURIComponent(nameInput.value) + '&email=' + encodeURIComponent(emailInput.value) + '&password=' + encodeURIComponent(passwordInput.value) + '&unit=' + encodeURIComponent(unitInput.value) + '&weeks=' + encodeURIComponent(weeksInput.value);

    const response = await fetch(url, { method: 'POST' });
    if (response.ok) {
      let data = await response.json();

      // If registration is successful, set a couple of localStorage caches and redirect to Dashboard
      if (data.register == 'true') {
        localStorage.setItem('login', 'true');
        localStorage.setItem('user', data.user);
        window.location.replace('../dashboard');
      }

    // If registration false, set styling, and inform the user that the account already exists
      if (data.register == 'false') {
          for (let input of inputs) {
          input.style.border = '0.1em solid #ff0000';
        }

        for (let validate of validation) {
          validate.style.display = 'none';
        }

        invalidRegister.style.height = '1.3em';
        invalidRegister.textContent = 'The account already exists on the server.';
      }
    } else {
      console.error('Error registering an account', response.status, response.statusText);
    }
  }
}
