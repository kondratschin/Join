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

window.addEventListener('load', function () {
  moveLogo();  // Führe die Logo-Animation aus, wenn die Seite geladen wird
  showContent(); // Zeige den Inhalt direkt danach
});

function backToLogInArrow() {
  let logo = document.getElementById("splash-screen");
  if (logo) {
    logo.classList.remove("logo-big"); // Entfernen der Klasse, die die Animation steuert
    logo.classList.add("logo-small"); // Direktes Umschalten auf die kleine Logo-Klasse
  }
  window.location.href = "logIn.html?returnHome=true";
}

const BASE_URL = "https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/";

async function getUsers() {
  let response = await fetch(BASE_URL + "users.json");
  return await response.json();
}

document.addEventListener('DOMContentLoaded', function () {
  let logInButton = document.getElementById('logInButton');
  let loginForm = document.getElementById('inputSection');

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
      for (let key in users) {
        if (users[key].email === email && users[key].password === password) {
          userFound = true;
          break;
        }
      }
      if (userFound) {
        alert("Login successful!");
        rememberMe(email, password);
        window.location.href = "./summary.html"; // Hier wird der Benutzer weitergeleitet
      } else {
        alert("Invalid email or password. Please try again.");
      }
    });
  }
  initRememberMe();
});

async function isEmailRegistered(email) {
  let users = await getUsers();
  for (let key in users) {
    if (users[key].email === email) {
      return true;
    }
  }
  return false;
}

function arePasswordsMatching(password, confirmPassword) {
  return password === confirmPassword;
}

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
  let response = await fetch(BASE_URL + "users/" + name +".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(logInData)
  });
  if (response.ok) {
    // Speichern der Anmeldedaten im Local Storage für die automatische Anmeldung
    localStorage.setItem('autoLoginEmail', email);
    localStorage.setItem('autoLoginPassword', password);
    showSuccessMessage();  // Zeige die Erfolgsmeldung
  } else {
    console.log("Error registering user.");
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const storedEmail = localStorage.getItem('autoLoginEmail');
  const storedPassword = localStorage.getItem('autoLoginPassword');

  if (storedEmail && storedPassword) {
    const emailInput = document.getElementById('mail-login');
    const passwordInput = document.getElementById('passwort-login');
    
    if (emailInput && passwordInput) {
      emailInput.value = storedEmail;
      passwordInput.value = storedPassword;

      // Optional: Automatisch das Login-Formular absenden
      // document.getElementById('login-form').submit();
    }
  }
}); 

function showSuccessMessage() {
  const overlay = document.createElement('div');
  overlay.className = 'success-overlay';
  document.body.appendChild(overlay);

  const successMessage = document.createElement('div');
  successMessage.className = 'success-container';
  successMessage.textContent = 'You Signed Up Successfully!';
  document.body.appendChild(successMessage);

  // Klasse sofort hinzufügen für eine flüssigere Animation
  requestAnimationFrame(() => {
      successMessage.classList.add('show');
  });

  setTimeout(() => {
      backToLogInArrow();
      document.body.removeChild(overlay);
  }, 2000);  // Verkürzte Zeit für die Demo
}

document.getElementById('inputSection').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission

  // Get form values
  let name = document.getElementById('signUpName').value;
  let email = document.getElementById('signUpEmail').value;
  let password = document.getElementById('signUpPassword').value;
  let passwordRepeat = document.getElementById('againSignUpPassword').value;

  // Check if passwords match
  if (password !== passwordRepeat) {
    alert('Passwords do not match!');
    return;
  }

  // Check if checkbox is checked
  let checkbox = document.getElementById('acceptPrivatPolicyButton');
  if (!checkbox.checked) {
    alert('Please accept the Privacy Policy.');
    return;
  }

  // Call the signUp function
  await signUp(email, password, passwordRepeat, name);
});

function transformLockIcon(x) {
  const element = document.getElementById(`lock${x}`);
  const inputElement = (x === 1) ? document.getElementById('signUpPassword') : document.getElementById('againSignUpPassword');
  if (element) {
    if (inputElement.value.length > 0) {
      element.src = "./img/eye.svg"; // Ändere das Bild zu einem Auge
    } else {
      element.src = "./img/lock.svg"; // Ändere das Bild zu einem Schloss
    }
  } else {
    console.error(`Element with ID lock${x} not found`);
  }
}

function hide(x) {
  const inputElement = (x === 1) ? document.getElementById('signUpPassword') : document.getElementById('againSignUpPassword');
  const iconElement = document.getElementById(`lock${x}`);

  if (inputElement.type === "password") {
    inputElement.type = "text";
    iconElement.src = "./img/hide.svg"; // Ändere das Bild zu einem geschlossenen Auge
  } else {
    inputElement.type = "password";
    iconElement.src = "./img/eye.svg"; // Ändere das Bild zu einem offenen Auge
  }
}

/**
 * Remember Me Funktion
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
 * Initialisiere die Remember Me Funktion
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
  } else {
    rememberMeCheckbox.checked = false;
  }
}
