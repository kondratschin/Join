/**
 * Moves the logo to the upper corner
 */
function moveLogo() {
  let logo = document.getElementById("splash-screen");
  logo.classList.remove("logo-big");
  logo.classList.add("logo-small");
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

/**
 * This needs to be moved to an event after loading database
 */
let currentPage = window.location.pathname.split("/").pop();
let currentSearchParams = new URLSearchParams(window.location.search);

if (currentPage === "logIn.html" && !currentSearchParams.has('returnHome')) {
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

/**
 * Hide an element by using ID
 * 
 * @param {string} id -  This is the ID of an element
 */
function displayNone(id) {
  document.getElementById(id).classList.add('d-none');
}

/**
 * Show an element by using ID
 * 
 * @param {string} id -  This is the ID of an element
 */
function displayElement(id) {
  document.getElementById(id).classList.remove('d-none');
}

function backToLogInArrow() {
  window.location.reload();
}

const BASE_URL = "https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/";

async function getUsers() {
  let response = await fetch(BASE_URL + "users.json");
  return await response.json();
}

document.addEventListener('DOMContentLoaded', function () {
  let signUpButton = document.getElementById('signUpButton');
  let logInButton = document.getElementById('logInButton');

  if (signUpButton) {
    signUpButton.addEventListener('click', async () => {
      let email = document.getElementById('signUpEmail').value;
      let password = document.getElementById('signUpPassword').value;
      let confirmPassword = document.getElementById('againSignUpPassword').value;
      let name = document.getElementById('signUpName').value;
      let checkbox = document.getElementById('acceptPrivatPolicyButton');

      if (!checkbox.disabled) {
        alert("Please accept the Privacy Policy to proceed.");
        return;
      }

      if (!email || !password || !confirmPassword || !name) {
        alert("Please fill in all fields to proceed.");
        return;
      }

      await signUp(email, password, confirmPassword, name);
    });

    document.getElementById('acceptPrivatPolicyButton').addEventListener('change', function () {
      signUpButton.disabled = !this.checked;
    });
  }

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
        window.location.href = "dashboard.html"; // Hier wird der Benutzer weitergeleitet
      } else {
        alert("Invalid email or password. Please try again.");
      }
    });
  }
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
  // Save the new user
  let logInData = {
    name: name,
    email: email,
    password: password
  };
  let response = await fetch(BASE_URL + "users.json", {
    method: "POST",
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

