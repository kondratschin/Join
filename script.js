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
window.addEventListener('load', () => {
  setTimeout(() => {
    moveLogo();
    setTimeout(showContent, 1000);  // Show content after the logo animation
  }, 1000);
});

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

// sign up section in JS (kann man evtl löschen sobald wir uns geeinigt haben das wir es hardcoden wollen)
function loadSignUp() {
  document.getElementById('title').innerHTML = "Sign up";
  document.getElementById('notUser').classList.add('d-none');
  document.getElementById('guestLogInButton').classList.add('d-none');
  document.getElementById('logInButton').innerHTML = "Sign up";
  document.getElementById('log-in').classList.remove('log-in-layout');
  document.getElementById('log-in').classList.add('signUpLayout');
  document.getElementById('logInButton').classList.remove('login-button');
  document.getElementById('logInButton').classList.add('sign-up-button');
  document.getElementById('backToLogInArrow').classList.remove('d-none');
  changeInputSection();
}

function changeInputSection() {
  let inputSection = document.getElementById('inputSection');
  inputSection.className = 'inputSectionSignUp';  // Ändere die Klasse
  inputSection.innerHTML = inputSectionHtml();    // Aktualisiere den inneren HTML-Inhalt
}

function inputSectionHtml() {
  return /*html*/ ` 
      <div class="login-credentials">
        <input type="name" id="signUpName" placeholder="Name" required>
        <img class="cred-icon" src="./img/person.svg" alt="">
      </div>
      <div class="login-credentials">
        <input type="email" name="" id="signUpEmail" placeholder="Email" required>
        <img class="cred-icon" src="./img/mail.svg" alt="">
      </div>
      <div class="login-credentials">
        <input type="password" id="signUpPassword" placeholder="Password" required>
        <img class="cred-icon" src="./img/lock.svg" alt="">
      </div>
      <div class="login-credentials">
        <input type="password" id="againSignUpPassword" placeholder="Repeat password" required>
        <img class="cred-icon" src="./img/lock.svg" alt="">
      </div>
    </form>
      <div class="accept-privacy-policy m-top24">
        <input class="rememberMe-button" type="checkbox" id="acceptPrivatPolicyButton" onclick="">
        <label class="rememberMe-text" for="rememberMe">I accept the <a href="#privacy-policy">Privacy Policy</a></label>
      </div>
  `;
}

function backToLogInArrow() {
  window.location.reload();
}

