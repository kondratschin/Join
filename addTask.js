let selectedContacts = [];
let subTaskList = [];

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

/**
 * Contacts from array 'selectedContacts' will be shown as selected/highlighted, if no contacts have been selected previously, contact list will be rendered
 */
function showContactDrp() {
    if (selectedContacts.length === 0) {
        createContactDrpDwn();
    }
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

    updateSelectedContacts(contactElement, isSelected, no);
}


function updateSelectedContacts(contactElement, isSelected, index) {
    const color = contactElement.querySelector('.initialsContact-small').style.background;
    const initials = contactElement.querySelector('.initialsContact-small').innerText;
    const name = contactElement.querySelector('span').innerText;

    if (isSelected) {
        // Add to selectedContacts
        selectedContacts.push({ index, color, initials, name });
    } else {
        // Remove from selectedContacts
        selectedContacts = selectedContacts.filter(contact => contact.index !== index);
    }
    selectedInitialIcos();
}


function toggleTwoElements(one, two) {
    document.getElementById(`${one}`).classList.toggle('d-none');
    document.getElementById(`${two}`).classList.toggle('d-none');
}


function alternateTwoElements(one, two) {
    document.getElementById(`${one}`).classList.remove('d-none');
    document.getElementById(`${two}`).classList.add('d-none');
}


function monitorInputFieldTitle() {
    let inputField = document.getElementById('task-title1');
    let errorSpan = document.getElementById('titleError');

  
    inputField.addEventListener('input', function() {
        if (inputField.value.trim() === '') {
            errorSpan.textContent = "Task title must not be empty";
        }
    });
}


/**
 * Disable submit button
 */
function disableButton() {
    document.getElementById('create-task-bttn').disabled = true;
    selectedContacts = [];
    subTaskList = [];
    document.getElementById('categoryError').innerHTML = "Please select category";
    document.getElementById('selected-category').innerHTML = "Select task category";
    document.getElementById('errorDate').innerHTML = "Please select date";
    displayNone('titleError');
    displayNone('errorDate');
    displayNone('categoryError');
    createContactDrpDwn();
}


/**
 * Show error messages if required fields are empty
 */
function showErrorMsg() {
    document.getElementById('errorDate').classList.remove('d-none');
    document.getElementById('titleError').classList.remove('d-none');
    document.getElementById('categoryError').classList.remove('d-none');
}

/**
 * Reset input field at Subtask
 */
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


  /**
 * Select category
 * 
 * @param {category} id -  This is the ID of clicked element
 */
function assignCategory(category) {
    document.getElementById('selected-category').innerHTML = `${category}`;
    document.getElementById('categoryError').innerHTML = "";
}


/**
 * Load contacts from Firebase into array
 */
async function loadContactsArray() {
    let response = await fetch(BASE_URL + "contacts/" + accName + ".json");
    let responseAsJson = await response.json();
    let contactsAsArray = Object.keys(responseAsJson);
    sortContactlist(responseAsJson, contactsAsArray);
}


/**
 * Contact list from array will be sorted
 */
function createContactDrpDwn() {
    let contactDrpDwn = document.getElementById('contact-content');
    contactDrpDwn.innerHTML = "";
    let selectedInitialIco = document.getElementById('selected-initial-ico');
    selectedInitialIco.innerHTML = "";

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


function selectedInitialIcos() {
    let selectedInitialIco = document.getElementById('selected-initial-ico');
    selectedInitialIco.innerHTML = ""; // Clear the existing content

    for (let i = 0; i < selectedContacts.length; i++) {
        let contact = selectedContacts[i];
        let color = contact.color;
        let initials = contact.initials;

        selectedInitialIco.innerHTML += /*html*/ `
            <div class="initialsContact-small" style="background: ${color}">${initials}</div>
        `;
    }
}


function pushToSubTaskList() {
    let newSubtask = document.getElementById('taskSub').value;
    subTaskList.push(newSubtask);
    resetInput();
    alternateTwoElements('subtask-plus', 'subtask-buttons');
    renderSubTaskList();
}


function renderSubTaskList() {
    let subTaskListHTML = document.getElementById('sub-task-list');
    subTaskListHTML.innerHTML = '';
    for (let i = 0; i < subTaskList.length; i++) {
        let subTask = subTaskList[i];
        
        subTaskListHTML.innerHTML += /*html*/ `
            <div id="sub-task-entry${i}" class="highlight-subtask sub-task-entry">
                <li id="subtask-in-list${i}">${subTask}</li>
                <div class="sub-task-buttons">
                    <img id="edit-small-img${i}" onclick="editTaskInList(${i})" class="plus" src="./img/edit-small.svg" alt="">
                    <img src="./img/separator-small.svg" alt="">
                    <img id="recycle-small-img${i}" onclick="deleteSubtaskHTML(${i})"; class="plus" src="./img/recycle.svg" alt="">
                </div>
            </div>
        `;
    }

    // Attach double-click event listeners
    for (let i = 0; i < subTaskList.length; i++) {
        let subTaskEntry = document.getElementById(`sub-task-entry${i}`);
        subTaskEntry.addEventListener('dblclick', () => {
            editTaskInList(i);
        });
    }
}


function deleteSubtaskHTML(index) {
    subTaskList.splice(index, 1);
      renderSubTaskList();
  }
  

  function editTaskInList(index) {
    // Get the subtask element to be edited
    let subTaskElement = document.getElementById(`subtask-in-list${index}`);
    let currentTask = subTaskList[index];
    let firstButtonImg = document.getElementById(`edit-small-img${index}`);
    let secondButtonImg = document.getElementById(`recycle-small-img${index}`);


    // Replace the subtask item with an input field prefilled with the current value
    subTaskElement.innerHTML = /*html*/ `
        <input type="text" id="edited-sub-task-${index}" value="${currentTask}">
    `;

    firstButtonImg.src = './img/recycle.svg';
    firstButtonImg.onclick = function() {
        deleteSubtaskHTML(index);
    };
    
    secondButtonImg.src = './img/check-small.svg';
    secondButtonImg.onclick = function() {
        saveEditedTask(index);
    };
    changeParentStyle(index);
}


function saveEditedTask(index) {
    // Get the edited value from the input field
    let editedTaskElement = document.getElementById(`edited-sub-task-${index}`);
    let editedTask = editedTaskElement.value.trim();

    if (editedTask) {
        // Update the subTaskList with the new value
        subTaskList[index] = editedTask;
        renderSubTaskList();
    } else {
        console.error("Edited subtask is empty");
    }
}


function changeParentStyle(index) {
    let childDiv = document.getElementById(`subtask-in-list${index}`);
    let parentDiv = childDiv.parentElement;

    childDiv.style.borderRadius = '0';
    childDiv.style.backgroundColor = '#ffffff';
    parentDiv.classList.remove('highlight-subtask');

    parentDiv.style.borderBottom = '1px solid #29ABE2';
    parentDiv.style.backgroundColor = '#ffffff';
}