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
