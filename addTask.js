let selectedContacts = [];

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
    createContactDrpDwn();
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
    const contactElement = document.getElementById(`contact-in-list${no}`);
    const isSelected = contactElement.classList.toggle('selected-contact');

    document.getElementById(`checked-button${no}`).classList.toggle('d-none');
    document.getElementById(`check-button${no}`).classList.toggle('d-none');

    updateSelectedContacts(contactElement, isSelected);
}

function updateSelectedContacts(contactElement, isSelected) {
    const color = contactElement.querySelector('.initialsContact-small').style.background;
    const initials = contactElement.querySelector('.initialsContact-small').innerText;
    const name = contactElement.querySelector('span').innerText;

    if (isSelected) {
        // Add to selectedContacts
        selectedContacts.push({ color, initials, name });
    } else {
        // Remove from selectedContacts
        selectedContacts = selectedContacts.filter(contact => contact.name !== name);
    }

    console.log(selectedContacts); // For debugging
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
    document.getElementById('categoryError').classList.remove('d-none');
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
        alternateTwoElements('subtask-plus', 'subtask-buttons');
    }
});


function assignCategory(category) {
    document.getElementById('selected-category').innerHTML = `${category}`;
}

async function loadContactsArray() {
    let response = await fetch(BASE_URL + "contacts/" + accName + ".json");
    let responseAsJson = await response.json();
    let contactsAsArray = Object.keys(responseAsJson);
    sortContactlist(responseAsJson, contactsAsArray);
}


function createContactDrpDwn() {
    let contactDrpDwn = document.getElementById('contact-content');
    contactDrpDwn.innerHTML = "";

    for (let i = 0; i < alphabetContainer.length; i++) {
        const sortLetterNr = alphabetContainer[i];
        showContactInDrpDwn(sortLetterNr, i);
    }
}


function showContactInDrpDwn(sortLetterNr, i) {
    for (let y = 0; y < sortLetterNr['list'].length; y++) {
        const LetterContactNr = sortLetterNr['list'][y];
        printContactDrpDwn(LetterContactNr, i);
    }
}


function printContactDrpDwn(LetterContactNr, i) {
    let contactDrpDwn = document.getElementById('contact-content');
    contactDrpDwn.innerHTML += "";
    let color = LetterContactNr['color'];
    let initials = LetterContactNr['name'].match(/\b(\w)/g).join('');
    let name = LetterContactNr['name'];


    contactDrpDwn.innerHTML += /*html*/ `
        <div onclick="highlightContact(${i})" id="contact-in-list${i}" class="contact-in-list pddng-12">
            <div class="flex-center">
                <div class="initialsContact-small" style="background: ${color}">${initials}</div>
                <span class="pddng-lft-12">${name}</span>
            </div><img id="check-button${i}" src="./img/check-button.svg" alt="">
            <img id="checked-button${i}" class="d-none" src="./img/checked-button.svg" alt="">
        </div>
    `;
}


