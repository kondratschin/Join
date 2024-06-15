// Hide the dropdown menu on clicks outside

document.addEventListener('click', function (event) {
    let dropdown = document.getElementById('myDropdown');
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
      displayNone(dropdown);
    }
  });


  /**
 * Hide an element by using ID
 * 
 * @param {string} id -  This is the ID of an element
 */
function displayNone(id) {
    document.getElementById(id).classList.toggle('d-none');
  }
  
  /**
   * Show an element by using ID
   * 
   * @param {string} id -  This is the ID of an element
   */
  function displayElement(id) {
    document.getElementById(id).classList.toggle('d-none');
  }