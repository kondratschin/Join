/**
 * Moves the logo to the upper corner unconditionally
 */
function moveLogo() {
  let logo = document.getElementById("splash-screen");
  if (logo) {
    logo.classList.remove("logo-big");
    logo.classList.add("logo-small");
  }
}


/**
 * Shows the content after the logo is moved
 */
function showContent() {
  let content = document.getElementById('content');
  content.classList.remove('d-none');
  setTimeout(() => {
    content.classList.add('visible');
  }, 10); // Slight delay to ensure transition
}


/**
 * Moves the logo and shows content after that
 */
window.addEventListener('load', function () {
  moveLogo();  // Execute logo animation when the page loads
  showContent(); // Show content immediately afterwards
});


/**
 * Returns to login screen
 */
function backToLogInArrow() {
    let logo = document.getElementById("splash-screen");
    if (logo) {
        logo.classList.remove("logo-big"); // Remove the class that controls the animation
        logo.classList.add("logo-small"); // Directly switch to the small logo class
    }
    window.location.href = "logIn.html?returnHome=true";
}


const BASE_URL = "https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/";


/**
 * Load user data from Firebase
 * @returns {Promise<Object>} The user data
 */
async function getUsers() {
  let response = await fetch(BASE_URL + "users.json");
  return await response.json();
}


/**
 * Handle user login on button click
 */
document.addEventListener('DOMContentLoaded', function () {
  let logInButton = document.getElementById('logInButton');

  if (logInButton) {
      logInButton.addEventListener('click', async () => {
          let email = document.getElementById('mail-login').value;
          let password = document.getElementById('passwort-login').value;

          if (!email || !password) {
              alert("Please fill in all fields to proceed.");
              return;
          }

          let users = await getUsers();
          let userFound = false;
          let userName = ''; // Variable to store the username

          for (let key in users) {
              if (users[key].email === email && users[key].password === password) {
                  userFound = true;
                  userName = users[key].name; // Store the name of the found user
                  break;
              }
          }
          if (userFound) {
              localStorage.setItem('userName', userName); // Store the username in local storage
              window.location.href = "./summary.html"; // Redirect to summary page
          } else {
              alert("Invalid email or password. Please try again.");
          }
      });
  }
  initRememberMe();
});


/**
 * Check if an email is registered
 * @param {*} email 
 * @returns {Promise<boolean>}
 */
async function isEmailRegistered(email) {
  let users = await getUsers();
  for (let key in users) {
      if (users[key].email === email) {
          return true;
      }
  }
  return false;
}


/**
 * Check if the password and confirm password fields match
 * @param {string} password 
 * @param {string} confirmPassword 
 * @returns {boolean}
 */
function arePasswordsMatching(password, confirmPassword) {
  return password === confirmPassword;
}


/**
 * Sign up a new user with email, password, confirmPassword, and name
 * @param {string} email 
 * @param {string} password 
 * @param {string} confirmPassword 
 * @param {string} name 
 */
async function signUp(email, password, confirmPassword, name) {
  if (await isEmailRegistered(email)) {
      alert("Email is already registered.");
      return;
  }
  if (!arePasswordsMatching(password, confirmPassword)) {
      alert("Passwords do not match.");
      return;
  }
  
  let logInData = {
      name: name,
      email: email,
      password: password
  };

  let response = await fetch(BASE_URL + "users/" + name + ".json", {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(logInData)
  });

  if (response.ok) {
      // Save login data in Local Storage for auto-login
      localStorage.setItem('autoLoginEmail', email);
      localStorage.setItem('autoLoginPassword', password);
      showSuccessMessage();  // Show success message
  } else {
      console.log("Error registering user.");
  }
}


/**
 * Auto log in
 */
document.addEventListener('DOMContentLoaded', function() {
  const storedEmail = localStorage.getItem('autoLoginEmail');
  const storedPassword = localStorage.getItem('autoLoginPassword');

  if (storedEmail && storedPassword) {
    const emailInput = document.getElementById('mail-login');
    const passwordInput = document.getElementById('passwort-login');
    
    if (emailInput && passwordInput) {
      emailInput.value = storedEmail;
      passwordInput.value = storedPassword;

      // Optional: Automatically submit the login form
      // document.getElementById('login-form').submit();
    }
  }
});


/**
 * Show success message
 */
function showSuccessMessage() {
  const overlay = document.createElement('div');
  overlay.className = 'success-overlay';
  document.body.appendChild(overlay);

  const successMessage = document.createElement('div');
  successMessage.className = 'success-container';
  successMessage.textContent = 'You Signed Up Successfully!';
  document.body.appendChild(successMessage);

    // Add class for smooth animation
  requestAnimationFrame(() => {
      successMessage.classList.add('show');
  });

  setTimeout(() => {
      backToLogInArrow();
      document.body.removeChild(overlay);
  }, 2000);
}


/**
 * Handle form submission
 */
document.getElementById('inputSection').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission

  // Reset all error messages
  document.querySelectorAll('.error-message').forEach(function(el) {
    el.style.display = 'none';
  });

  // Get form values
  const name = document.getElementById('signUpName').value;
  const email = document.getElementById('signUpEmail').value;
  const password = document.getElementById('signUpPassword').value;
  const confirmPassword = document.getElementById('againSignUpPassword').value;
  const acceptPolicy = document.getElementById('acceptPrivatPolicyButton').checked;

  let hasError = false;

  // Validation checks
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailPattern.test(email)) {
    document.getElementById('emailError').textContent = "Please enter a valid email address.";
    document.getElementById('emailError').style.display = 'block';
    hasError = true;
  }

  if (password.length < 6) {
    document.getElementById('passwordError').textContent = "Password must be at least 6 characters long.";
    document.getElementById('passwordError').style.display = 'block';
    hasError = true;
  }

  if (password !== confirmPassword) {
    document.getElementById('confirmPasswordError').textContent = "Passwords do not match.";
    document.getElementById('confirmPasswordError').style.display = 'block';
    hasError = true;
  }

  if (!acceptPolicy) {
    document.getElementById('policyError').textContent = "You must accept the Privacy Policy.";
    document.getElementById('policyError').style.display = 'block';
    hasError = true;
  }

  if (hasError) {
    return; // Stop execution if there are errors
  }

  // Call the signUp function if no errors
  await signUp(email, password, confirmPassword, name);
});


/**
 * Changes between lock and eye symbol
 * @param {*} x 
 */
function transformLockIcon(x) {
  const element = document.getElementById(`lock${x}`);
  const inputElement = (x === 1) ? document.getElementById('signUpPassword') : document.getElementById('againSignUpPassword');
  if (element) {
    if (inputElement.value.length > 0) {
      element.src = "./img/eye.svg"; // Change image to eye
    } else {
      element.src = "./img/lock.svg"; // Change image to lock
    }
  } else {
    console.error(`Element with ID lock${x} not found`);
  }
}


/**
 * Toggle password visibility
 * @param {*} x 
 */
function hide(x) {
  const inputElement = (x === 1) ? document.getElementById('signUpPassword') : document.getElementById('againSignUpPassword');
  const iconElement = document.getElementById(`lock${x}`);

  if (inputElement.type === "password") {
    inputElement.type = "text";
    iconElement.src = "./img/hide.svg"; // Change image to closed eye
  } else {
    inputElement.type = "password";
    iconElement.src = "./img/eye.svg"; // Change image to open eye
  }
}


/**
 * Remember Me function
 */
function rememberMe(email, password) {
  let rememberMeCheckbox = document.getElementById('rememberMe');
  if (rememberMeCheckbox.checked) {
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    localStorage.setItem('rememberMe', true);
  } else {
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('rememberMe');
  }
}


/**
 * Init remember me function
 */
function initRememberMe() {
  let emailInput = document.getElementById('mail-login');
  let passwordInput = document.getElementById('passwort-login');
  let rememberMeCheckbox = document.getElementById('rememberMe');

  if (localStorage.getItem('rememberMe') === 'true') {
    let savedEmail = localStorage.getItem('email');
    let savedPassword = localStorage.getItem('password');

    emailInput.value = savedEmail;
    passwordInput.value = savedPassword;
    rememberMeCheckbox.checked = true;
  }
}


/**
 * Guest login clear data
 */
function guestLogIn() {
  localStorage.clear(); // deletes localStorage
  window.location.href = "./summary.html"; 
}
