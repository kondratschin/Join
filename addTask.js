document.addEventListener('DOMContentLoaded', () => {
    const createTaskButton = document.getElementById('create-task-bttn');

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
        let errorSpan = taskDateInput.nextElementSibling;

        // Create errorSpan if it doesn't exist
        if (!errorSpan || !errorSpan.classList.contains('error')) {
            errorSpan = document.createElement('span');
            errorSpan.classList.add('error');
            taskDateInput.parentNode.appendChild(errorSpan);
        }

        const taskDate = taskDateInput.value;

        // Überprüfen, ob ein Datum eingegeben wurde
        if (!taskDate) {
            createTaskButton.disabled = true;
            errorSpan.textContent = "Please select a date.";
            return;
        }

        // Überprüfen, ob das Datum gültig ist (z.B. nicht in der Vergangenheit)
        const selectedDate = new Date(taskDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Nur das Datum vergleichen

        if (selectedDate < today) {
            createTaskButton.disabled = true;
            errorSpan.textContent = "Please select a future date.";
        } else {
            errorSpan.textContent = ""; // Fehlermeldung löschen
            validateForm();
        }
    }

    function validateTitle() {
        const taskTitleInput = document.getElementById('task-title1');
        let errorSpan = taskTitleInput.nextElementSibling;

        // Create errorSpan if it doesn't exist
        if (!errorSpan || !errorSpan.classList.contains('error')) {
            errorSpan = document.createElement('span');
            errorSpan.classList.add('error');
            taskTitleInput.parentNode.appendChild(errorSpan);
        }

        const taskTitle = taskTitleInput.value.trim();

        // Überprüfen, ob ein Titel eingegeben wurde
        if (!taskTitle) {
            createTaskButton.disabled = true;
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


  function resetInput() {
    document.getElementById('taskSub').value = ""; 
  }

