/**
 * moves the logo to the upper corner
 */
function moveLogo() {
  let logo = document.getElementById("splash-screen");
  logo.classList.remove("logo-big");
  logo.classList.add("logo-small");
}


/**
 * This needs to be moved to an event after loading database
 */
setTimeout(moveLogo, 1000);


/**
 * Hide an element by using ID
 * 
 * @param {string} id -  This is the ID of an element
 */
function displayNone(id) {
  document.getElementById(id).classList.add('d-none');
}


/**
 * show an element by using ID
 * 
 * @param {string} id -  This is the ID of an element
 */
function displayElement(id) {
  document.getElementById(id).classList.remove('d-none');
}

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
        <img class="cred-icon" src="./img/mail.svg" alt="">
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
        <input type="password" id="againSignUpPassword" placeholder="Password" required>
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

