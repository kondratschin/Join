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