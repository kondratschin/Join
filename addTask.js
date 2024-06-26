document.addEventListener('DOMContentLoaded', () => {


    document.addEventListener('input', (event) => {
        if (event.target.id === 'taskDate') {
            validateDate();
        }
        if (event.target.id === 'task-title1') {
            validateTitle();
        }
    });

    function validateDate() {
        const taskDateInput = document.getElementById('taskDate');
        let errorSpan = document.getElementById('errorDate');

        const taskDate = taskDateInput.value;


        // Überprüfen, ob das Datum gültig ist (z.B. nicht in der Vergangenheit)
        const selectedDate = new Date(taskDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Nur das Datum vergleichen


        
        if (selectedDate < today) {

            errorSpan.textContent = "Please select a future date.";
            
        } else {
            errorSpan.textContent = ""; // Fehlermeldung löschen
            validateForm();
        }
    }

    function validateTitle() {
        const taskTitleInput = document.getElementById('task-title1');
        let errorSpan = document.getElementById('titleError');

        const taskTitle = taskTitleInput.value.trim();

        // Überprüfen, ob ein Titel eingegeben wurde
        if (!taskTitle) {
            errorSpan.textContent = "Task title must not be empty.";
        } else {
            errorSpan.textContent = ""; // Fehlermeldung löschen
            validateForm();
        }
    }

    function validateForm() {
        const taskDateInput = document.getElementById('taskDate').value;
        const taskTitleInput = document.getElementById('task-title1').value.trim();

        if (taskDateInput && taskTitleInput) {
            document.getElementById('create-task-bttn').disabled = false;
        }
    }
});


function showContactDrp() {
    document.getElementById('contact-drp-dwn').classList.toggle('d-none');
    document.getElementById('arrow-drp-dwn').classList.toggle('flip-vertically');
}


function showCategoryDrp() {
    document.getElementById('category-drp-dwn').classList.toggle('d-none');
    document.getElementById('arrow-drp-dwn2').classList.toggle('flip-vertically');
}


function hideCategoryDrp() {
    document.getElementById('category-drp-dwn').classList.add('d-none');
    document.getElementById('arrow-drp-dwn2').classList.remove('flip-vertically');
}


function hideContactDrp() {
    document.getElementById('contact-drp-dwn').classList.add('d-none');
    document.getElementById('arrow-drp-dwn').classList.remove('flip-vertically');
}


function prioritySelected(id, className, arrow) {
    removeSelection(id);
    document.getElementById(id).classList.toggle(className);
    document.getElementById(id).classList.toggle(arrow);
}


function removeSelection(id) {
    if (id == 'prio-baja') {
        document.getElementById('prio-alta').classList.remove('prio-select-red');
        document.getElementById('prio-alta').classList.remove('prio-select');
        document.getElementById('prio-media').classList.remove('prio-select-orange');
        document.getElementById('prio-media').classList.remove('prio-select');
    };
    if (id == 'prio-media') {
        document.getElementById('prio-alta').classList.remove('prio-select-red');
        document.getElementById('prio-alta').classList.remove('prio-select');
        document.getElementById('prio-baja').classList.remove('prio-select-green');
        document.getElementById('prio-baja').classList.remove('prio-select');
    };
    if (id == 'prio-alta') {
        document.getElementById('prio-media').classList.remove('prio-select-orange');
        document.getElementById('prio-media').classList.remove('prio-select');
        document.getElementById('prio-baja').classList.remove('prio-select-green');
        document.getElementById('prio-baja').classList.remove('prio-select');
    };
}


function highlightContact(no) {
    document.getElementById(`checked-button${no}`).classList.toggle('d-none');
    document.getElementById(`check-button${no}`).classList.toggle('d-none');
    document.getElementById(`contact-in-list${no}`).classList.toggle('selected-contact');
}


function toggleTwoElements(one, two) {
    document.getElementById(`${one}`).classList.toggle('d-none');
    document.getElementById(`${two}`).classList.toggle('d-none');
}


function alternateTwoElements(one, two) {
    document.getElementById(`${one}`).classList.remove('d-none');
    document.getElementById(`${two}`).classList.add('d-none');
}


function disableButton() {
    document.getElementById('create-task-bttn').disabled = true;
}

function showErrorMsg() {
    document.getElementById('errorDate').classList.remove('d-none');
    document.getElementById('titleError').classList.remove('d-none');
    }
    

  function resetInput() {
    document.getElementById('taskSub').value = ""; 
  }


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
        hideCategoryDrp();
        hideContactDrp();
        alternateTwoElements('category-plus', 'category-buttons');
    }
  });
