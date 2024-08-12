let selectedContacts = [];
let subTaskList = [];
let priority = 'Medium';
let chosenCategory = [];
let boardStatus = ['toDo']; //defines in which list in the board the task will be put
let statusFromBoard = localStorage.getItem('boardStatus');
if (!statusFromBoard) {
    statusFromBoard = 'toDo'; // Set default status to 'toDo'
}

/**
 * Sets the status of the board.
 * @param {string} statusFromBoard - The name of the list in the board.
 */
function setBoardStatus(statusFromBoard) {
    boardStatus = statusFromBoard;
    localStorage.removeItem('boardStatus');
}

/**
 * Stores the status in localStorage to retrieve it in the addTask.html page.
 * @param {string} status - The status to be stored.
 */
function openAddTaskPage(status) {
    localStorage.setItem('boardStatus', status);
    window.location.href = 'addTask.html';
}

/**
 * Validates the form by checking all required inputs.
 */
function validateForm() {
    const taskDateInput = document.getElementById('taskDate').value;
    const taskTitleInput = document.getElementById('task-title1').value.trim();
    const taskCategory = document.getElementById('selected-category').textContent;

    if (taskDateInput && taskTitleInput) {
        if (taskCategory.includes('Select task category')) {
            document.getElementById('create-task-bttn').disabled = true;
        } else {
            document.getElementById('create-task-bttn').disabled = false;
        }
    } else {
        document.getElementById('create-task-bttn').disabled = true;
    }
}

/**
 * EventListener checks the required inputs. If required fields are filled, the submit button will be enabled.
 */
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

        const selectedDate = new Date(taskDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            errorSpan.textContent = "Please select a future date.";
        } else {
            errorSpan.textContent = "";
            validateForm(); // Call validateForm after successful validation
        }
    }

    function validateTitle() {
        const taskTitleInput = document.getElementById('task-title1');
        let errorSpan = document.getElementById('titleError');

        const taskTitle = taskTitleInput.value.trim();

        if (!taskTitle) {
            errorSpan.textContent = "Task title must not be empty.";
            forceDisableButton();
        } else {
            errorSpan.textContent = "";
            validateForm(); // Call validateForm after successful validation
        }
    }
});

/**
 * Monitors the title input field for changes and validates its content.
 */
function monitorInputFieldTitle() {
    let inputField = document.getElementById('task-title1');
    let errorSpan = document.getElementById('titleError');

    inputField.addEventListener('input', function () {
        if (inputField.value.trim() === '') {
            errorSpan.textContent = "Task title must not be empty.";
        } else {
            errorSpan.textContent = "";
        }
    });
}

/**
 * Forces the Create Task button to be disabled.
 */
function forceDisableButton() {
    let createButton = document.getElementById('create-task-bttn');
    createButton.disabled = true;
}

/**
 * Contacts from the array 'selectedContacts' will be shown as selected/highlighted.
 */
function showContactDrp() {
    if (selectedContacts.length === 0) {
        createContactDrpDwn();
    }
    document.getElementById('contact-drp-dwn').classList.toggle('d-none');
    document.getElementById('arrow-drp-dwn').classList.toggle('flip-vertically');
}

/**
 * Toggles the visibility of the category dropdown.
 */
function showCategoryDrp() {
    document.getElementById('category-drp-dwn').classList.toggle('d-none');
    document.getElementById('arrow-drp-dwn2').classList.toggle('flip-vertically');
}

/**
 * Hides the category dropdown.
 */
function hideCategoryDrp() {
    document.getElementById('category-drp-dwn').classList.add('d-none');
    document.getElementById('arrow-drp-dwn2').classList.remove('flip-vertically');
}

/**
 * Hides the contact dropdown.
 */
function hideContactDrp() {
    document.getElementById('contact-drp-dwn').classList.add('d-none');
    document.getElementById('arrow-drp-dwn').classList.remove('flip-vertically');
}

/**
 * Highlights the clicked priority button and removes the highlight from other buttons.
 * @param {string} id - The ID of the priority button.
 * @param {string} className - The class name for the color highlight.
 * @param {string} arrow - The class name for the arrow color.
 */
function prioritySelected(id, className, arrow) {
    removeSelection(id);
    document.getElementById(id).classList.add(className);
    document.getElementById(id).classList.add(arrow);
    if (id === 'prio-baja') {
        priority = 'Low';
    } else if (id === 'prio-media') {
        priority = 'Medium';
    } else if (id === 'prio-alta') {
        priority = 'High';
    }
}

/**
 * Removes the highlights from priority buttons.
 * @param {string} id - The ID of the selected priority button.
 */
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

/**
 * Highlights selected contacts from the dropdown list.
 * @param {number} i - Index in the JSON 'alphabetContainer'.
 * @param {number} y - Value from the list in 'alphabetContainer'.
 */
function highlightContact(i, y) {
    const contactElement = document.getElementById(`contact-in-list${i}-${y}`);
    const isSelected = contactElement.classList.toggle('selected-contact');

    document.getElementById(`checked-button${i}-${y}`).classList.toggle('d-none');
    document.getElementById(`check-button${i}-${y}`).classList.toggle('d-none');

    updateSelectedContacts(contactElement, isSelected, i, y);
}

/**
 * Updates the array 'selectedContacts' with newly selected contacts.
 * @param {HTMLElement} contactElement - The newly selected contact element.
 * @param {boolean} isSelected - Indicates if the contact is selected.
 * @param {number} i - Index in the JSON 'alphabetContainer'.
 * @param {number} y - Value from the list in 'alphabetContainer'.
 */
function updateSelectedContacts(contactElement, isSelected, i, y) {
    const color = contactElement.querySelector('.initialsContact-small').style.background;
    const initials = contactElement.querySelector('.initialsContact-small').innerText;
    const name = contactElement.querySelector('span').innerText;

    if (isSelected) {
        // Add to selectedContacts
        selectedContacts.push({ index: `${i}-${y}`, color, initials, name });
    } else {
        // Remove from selectedContacts
        selectedContacts = selectedContacts.filter(contact => contact.index !== `${i}-${y}`);
    }
    selectedInitialIcos();
}

/**
 * Disables the submit button and clears fields.
 */
function disableButton() {
    document.getElementById('create-task-bttn').disabled = true;
    selectedContacts = [];
    subTaskList = [];
    document.getElementById('categoryError').innerHTML = "Please select category";
    document.getElementById('selected-category').innerHTML = "Select task category";
    document.getElementById('errorDate').innerHTML = "Please select date";
    resetInput();
    displayNone('titleError');
    displayNone('errorDate');
    displayNone('categoryError');
    renderSubTaskList();
    createContactDrpDwn();
}

/**
 * Shows error messages if required fields are empty.
 */
function showErrorMsg() {
    document.getElementById('errorDate').classList.remove('d-none');
    document.getElementById('titleError').classList.remove('d-none');
    document.getElementById('categoryError').classList.remove('d-none');
}

/**
 * Assigns a category.
 * @param {string} category - The ID of the clicked element.
 */
function assignCategory(category) {
    document.getElementById('selected-category').innerHTML = `${category}`;
    document.getElementById('categoryError').innerHTML = "";
    chosenCategory = [];
    chosenCategory.push(category);
    validateForm();
}

/**
 * Loads contacts from Firebase into an array.
 */
async function loadContactsArray() {

    if (!accName || accName.trim() === '') {
        return;
    }
    localStorage.removeItem('contacts');
    let response = await fetch(BASE_URL + "contacts/" + accName + ".json");
    let responseAsJson = await response.json();
    let contactsAsArray = Object.keys(responseAsJson);
    sortContactlist(responseAsJson, contactsAsArray);
    createContactDrpDwn();
}

/**
 * Creates the contact dropdown by sorting the contact list from the array.
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

/**
 * Shows the contacts in the dropdown list.
 * @param {number} sortLetterNr - The sorted letter number.
 * @param {number} i - The index in the alphabetContainer.
 */
function showContactInDrpDwn(sortLetterNr, i) {
    for (let y = 0; y < sortLetterNr['list'].length; y++) {
        const LetterContactNr = sortLetterNr['list'][y];
        printContactDrpDwn(LetterContactNr, y, i);
    }
}

/**
 * Creates the HTML content for a contact in the dropdown list.
 * @param {Object} letterContactNr - The contact information.
 * @param {number} y - The index in the sorted list.
 * @param {number} i - The index in the alphabetContainer.
 */
function printContactDrpDwn(LetterContactNr, y, i) {
    let contactDrpDwn = document.getElementById('contact-content');
    contactDrpDwn.innerHTML += createContactHtml(LetterContactNr, y, i);
}

/**
 * Creates the icons below the dropdown menu.
 */
function selectedInitialIcos() {
    let selectedInitialIco = document.getElementById('selected-initial-ico');
    selectedInitialIco.innerHTML = ""; // Clear the existing content

    selectedInitialIco.innerHTML += createSelectedInitialIcons();
}

/**
 * Opens the board page.
 */
function openBoardPage() {
    window.location.href = './board.html';
}

/**
 * Resets the form, deletes all fields, and ensures that the button is disabled.
 * @returns {boolean} Always returns false to prevent form submission.
 */
function addTaskEvent() {
    let taskTitle = document.getElementById('task-title1').value;
    taskTitle = String(taskTitle);
    createTask(taskTitle);
    // disableButton(); not required 
    // document.getElementById('taskForm').reset();
    return false;
}

/**
 * Generates the HTML content for the selected initial icons.
 * @returns {string} - The HTML string for the selected initial icons.
 */
function createSelectedInitialIcons() {
    let htmlContent = '';

    for (let i = 0; i < Math.min(selectedContacts.length, 5); i++) {
        let contact = selectedContacts[i];
        let color = contact.color;
        let initials = contact.initials;

        htmlContent += /*html*/ `
            <div class="initialsContact-small" style="background: ${color}">${initials}</div>
        `;
    }

    if (selectedContacts.length > 5) {
        let additionalCount = selectedContacts.length - 5;
        htmlContent += `<div class="initialsContact-small">+${additionalCount}</div>`;
    }

    return htmlContent;
}