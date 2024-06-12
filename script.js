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


