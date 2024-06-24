/**
 * Remember me funktion korrigieren 
 * sign up transition darf nicht sein
 * pop up bei erfolgreichem registrieren 
 */
/**
 * Moves the logo to the upper corner
 */
function moveLogo() {
  let logo = document.getElementById("splash-screen");
  logo.classList.remove("logo-big");
  logo.classList.add("logo-small");
  // Speichern, dass die Animation ausgeführt wurde
  localStorage.setItem('logoAnimated', 'true');
}

/**
 * Shows the content after the logo is moved
 */
function showContent() {
  document.getElementById('content').classList.remove('d-none');
  setTimeout(() => {
    document.getElementById('content').classList.add('visible');
  }, 10); // Slight delay to ensure transition
}

let currentPage = window.location.pathname.split("/").pop();
let currentSearchParams = new URLSearchParams(window.location.search);

// Überprüfen, ob die Animation bereits ausgeführt wurde
let logoAnimated = localStorage.getItem('logoAnimated');

if (currentPage === "logIn.html" && !currentSearchParams.has('returnHome') && !logoAnimated) {
  window.addEventListener('load', function () {
    setTimeout(function () {
      moveLogo();  // Führe die Logo-Animation aus
      showContent(); // Zeige den Inhalt direkt danach
    }, 1000); // Warte 1 Sekunde vor Beginn der Animationen
  });
} else {
  showContent(); // Zeige den Inhalt sofort, wenn auf login.html?returnHome oder einer anderen Seite
  moveLogo();
}

function displayNone(id) {
  document.getElementById(id).classList.add('d-none');
}

function displayElement(id) {
  document.getElementById(id).classList.remove('d-none');
}

function backToLogInArrow() {
  // Entferne den Zustand, um die Animation beim nächsten Laden zu verhindern
  localStorage.setItem('logoAnimated', 'false');
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
        // Speichere oder lösche Login-Daten basierend auf der "Remember Me" Auswahl
        rememberMe(email, password);
        window.location.href = "./summary.html"; // Hier wird der Benutzer weitergeleitet
      } else {
        alert("Invalid email or password. Please try again.");
      }
    });
  }

  // Initialisiere die Remember Me Funktion
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
    alert("User registered successfully.");
  } else {
    console.log("Error registering user.");
  }
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
