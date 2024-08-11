// Hide the dropdown menu on clicks outside

document.addEventListener('click', function (event) {
    let excludedObjects = document.querySelectorAll('.excludedObject');
    let clickedElement = event.target;
    let isExcluded = false;
  
    // Check if the clicked element is contained within any excluded object
    excludedObjects.forEach(function (object) {
      if (object.contains(clickedElement)) {
        isExcluded = true;
      }
    });
  
    // If the clicked element is not contained within any excluded object, call the function
    if (!isExcluded) {
      displayNone('myDropdown');
    }
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


    /**
   * toggle an element by using ID
   * 
   * @param {string} id -  This is the ID of an element
   */
    function toggleElement(id) {
        document.getElementById(id).classList.toggle('d-none');
      }


      async function includeHTML() {
        let includeElements = document.querySelectorAll('[w3-include-html]');
        for (let i = 0; i < includeElements.length; i++) {
            const element = includeElements[i];
            file = element.getAttribute("w3-include-html"); // "includes/header.html"
            let resp = await fetch(file);
            if (resp.ok) {
                element.innerHTML = await resp.text();
            } else {
                element.innerHTML = 'Page not found';
            }
        }
    }


function navbarPicked(id) {
  document.getElementById(`${id}`).classList.add('navbarPicked');
}


/**
 * 
 * @param {string} navbar - this is the navbar which will be selected
 */
async function loadContent(navbar) {
  await includeHTML();
  navbarPicked(`${navbar}`);
  changeInitials();
}


function changeInitials() {
  let initialsElement = document.getElementById('initials');
  let fullName = localStorage.getItem('userName'); // Assume the full name is stored
  
  if (fullName) {
      let names = fullName.split(' '); // Split the name into parts
      let initials = names.map(name => name[0]).join(''); // Take the first letter of each part and join them
      
      initialsElement.innerHTML = initials; // Set the initials as innerHTML
  } else {
      initialsElement.innerHTML = "G"; // Default initials if no name is found
  }
}

/**
 * function returns user name
 * @returns 
 */
function getName() {
  let name = localStorage.getItem('userName');
  return name; // Return the retrieved name
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

/**
* Stop the propagation of the displayNone event
* 
* @param {Event} event - The click event
*/
function stopPropagation(event) {
  event.stopPropagation();
}

/**
 * Set opacity from element to 1
 * 
 * @param {string} id - This is the ID of an element
*/
function appear(id) {
  document.getElementById(id).classList.remove('vanish');
  document.getElementById(id).classList.add('appear');
}

/**
* Set opacity from element to 0
*  
* @param {string} id - This is the ID of an element
*/
function vanish(id) {
  document.getElementById(id).classList.remove('appear');
  document.getElementById(id).classList.add('vanish');
}

/**
 * Adjusts the visibility of contact details and adds or removes event listeners based on the window width.
 * 
 */
function checkWidthAndAddClickListener() {
  let contactCartElements = document.getElementsByClassName('contactCart');
  if (window.innerWidth <= 770) {
      document.getElementById('contactsDetailBackarrow').classList.remove('d-none');
      for (let contactCart of contactCartElements) {
          contactCart.addEventListener("click", showContactDetailsMobile);
      }
  } else {
      document.getElementById('contactsDetailBackarrow').classList.add('d-none');
      document.getElementById('contactsRightsideContent').classList.remove('d-none');
      document.getElementById('contactsContent').classList.remove('d-none');
      for (let contactCart of contactCartElements) {
          contactCart.removeEventListener("click", showContactDetailsMobile);
      }
  }
}

if (window.location.pathname === '/contacts.html') {
window.addEventListener("resize", checkWidthAndAddClickListener);
}

/**
 * Slides in element 
 * 
 * @param {string} id - This is the ID of an element
*/
function fadeIn(id) {
  document.getElementById(id).classList.remove('fadeOut');
  document.getElementById(id).classList.add('fadeIn');
}

/**
* Slides out element 
* 
* @param {string} id - This is the ID of an element
*/
function fadeOut(id) {
  document.getElementById(id).classList.remove('fadeIn');
  document.getElementById(id).classList.add('fadeOut');
}

/**
* Slides in element in mobile version
* 
* @param {string} id - This is the ID of an element
*/
function mobileFadeIn(id) {
  document.getElementById(id).classList.remove('mobileOptionFadeOut');
  document.getElementById(id).classList.add('mobileOptionFadeIn');
}

/**
* Slides out element in mobile version
* 
* @param {string} id - This is the ID of an element
*/
function mobileFadeOut(id) {
  document.getElementById(id).classList.remove('mobileOptionFadeIn');
  document.getElementById(id).classList.add('mobileOptionFadeOut');
}