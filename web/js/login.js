/* Login JS */

/* Event listeners */

/* Accessibility Keyboard Shortcuts */

function keyboardShortcuts(event) {
  // Ctrl E to focus on the email field
  if (event.ctrlKey && event.keyCode == 69) {
    emailInput.focus();
  }

  // Ctrl P to focus on the password field
  if (event.ctrlKey && event.keyCode == 80) {
    passwordInput.focus();
  }

  // Ctrl L to trigger the login function
  if (event.ctrlKey && event.keyCode == 76) {
    login();
  }

  // Ctrl R to redirect to the Register page
  if (event.ctrlKey && event.keyCode == 82) {
    window.location.href = 'register';
  }
}

document.addEventListener('keyup', keyboardShortcuts);

// Login event listeners
loginSubmit.addEventListener('click', login);
passwordInput.addEventListener('keydown', function() {
  if (event.keyCode == 13) {
    login();
  }
});

// Login function
async function login() {
  // validEmail regular expression
  let validEmail = /^([a-zA-Z0-9\_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  // Check for valid email and password
  if (!validEmail.test(emailInput.value)) {
    invalidLogin.textContent = '* Your email is invalid';
    invalidLogin.style.display = 'inline-block';
  } else if (passwordInput.value == '') {
    invalidLogin.textContent = '* A password is required';
    invalidLogin.style.display = 'inline-block';
  }

  const url = '/api/login?email=' + encodeURIComponent(emailInput.value) + '&password=' + encodeURIComponent(passwordInput.value);

  // Fetch login
  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();

    // If login successful, set a couple of localStorage caches and redirect to Dashboard
    if (data.login == 'true') {
      localStorage.setItem('login', 'true');
      localStorage.setItem('user', data.user);
      window.location.replace('dashboard');
    }

    // If login false, set styling, and inform the user that the account does not exist
    if (data.login == 'false') {
      emailInput.style.border = '0.1em solid #FF0000';
      passwordInput.style.border = '0.1em solid #FF0000';

      if (validEmail.test(emailInput.value) && passwordInput.value.length >= 1) {
        invalidLogin.textContent = 'The account does not exist on the server.';
        invalidLogin.style.display = 'inline-block';
      }

      // Add reset event listeners
      let inputs = document.getElementsByClassName('input');
      for (let input of inputs) {
        input.addEventListener('click', reset);
        input.addEventListener('focus', reset);
      }
    }
  } else {
    console.error('Error logging in', response.status, response.statusText);
  }
}

// Reset styling function
function reset() {
  invalidLogin.style.display = 'none';
  emailInput.style.border = '0.1em solid #000';
  passwordInput.style.border = '0.1em solid #000';
}
