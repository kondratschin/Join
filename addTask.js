let selectedContacts = [];
let subTaskList = [];
let priority;
let chosenCategory = [];
let boardStatus = ['toDo']; //defines in which list in the board the task will be put

let statusFromBoard = localStorage.getItem('boardStatus');
if (!statusFromBoard) {
    statusFromBoard = 'toDo'; // Set default status to 'toDo'
}

// document.addEventListener('DOMContentLoaded', (event) => {
//     setTimeout(() => {
//         prioritySelected('prio-media', 'prio-select-orange', 'prio-select');
//     }, 500);
// })


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
// Wait for DOMContentLoaded to ensure DOM is fully loaded
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
 * If no contacts have been selected previously, the contact list will be rendered.
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
 * The className describes the color and toggles the color on or off.
 * The arrow sets the text color to white and also toggles the arrow.
 * @param {string} id - The ID of the priority button.
 * @param {string} className - The class name for the color highlight.
 * @param {string} arrow - The class name for the arrow color.
 */
function prioritySelected(id, className, arrow) {
    removeSelection(id);
    document.getElementById(id).classList.toggle(className);
    document.getElementById(id).classList.toggle(arrow);
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
 * Toggles the visibility between two elements.
 * @param {string} one - The ID of the first element.
 * @param {string} two - The ID of the second element.
 */
function toggleTwoElements(one, two) {
    document.getElementById(`${one}`).classList.toggle('d-none');
    document.getElementById(`${two}`).classList.toggle('d-none');
}


/**
 * Removes 'display: none' from the first element and adds 'display: none' to the second element.
 * @param {string} one - The ID of the first element.
 * @param {string} two - The ID of the second element.
 */
function alternateTwoElements(one, two) {
    document.getElementById(`${one}`).classList.remove('d-none');
    document.getElementById(`${two}`).classList.add('d-none');
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
 * Resets the input field for the subtask.
 */
function resetInput() {
    document.getElementById('taskSub').value = "";
}


/**
 * Hides the dropdown menus if clicked somewhere else.
 */
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
 * Assigns a category.
 * 
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


/**
 * Creates and adds a new subtask to the subtask list.
 */
function pushToSubTaskList() {
    let newSubtask = document.getElementById('taskSub').value;

    // Check if newSubtask has at least one character
    if (newSubtask.length >= 1) {
        subTaskList.push({ name: newSubtask, complete: false });
        resetInput();
        alternateTwoElements('subtask-plus', 'subtask-buttons');
        renderSubTaskList();
    }
}


/**
 * Renders the subtask list and adds event listeners for the double-click edit function.
 */
function renderSubTaskList() {
    let subTaskListHTML = document.getElementById('sub-task-list');
    subTaskListHTML.innerHTML = '';

    // Determine the starting index based on the length of subTaskList
    let startIndex = Math.max(0, subTaskList.length - 2); // Start from the last two items or less

    // Generate and append the HTML content for the subtasks
    subTaskListHTML.innerHTML = createSubTaskListHtml(subTaskList, startIndex);

    // Attach double-click event listeners for the displayed entries
    for (let i = startIndex; i < subTaskList.length; i++) {
        let subTaskEntry = document.getElementById(`sub-task-entry${i}`);
        subTaskEntry.addEventListener('dblclick', () => {
            editTaskInList(i);
        });
    }
}


/**
 * Deletes an entry from the locally rendered subtask list.
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtaskHTML(index) {
    subTaskList.splice(index, 1);
    renderSubTaskList();
}


/**
 * Edit function for the subtask list.
 * @param {number} index - The index of the subtask to edit.
 */
function editTaskInList(index) {
    let subTaskElement = document.getElementById(`subtask-in-list${index}`);
    let currentTask = subTaskList[index];
    let firstButtonImg = document.getElementById(`edit-small-img${index}`);
    let secondButtonImg = document.getElementById(`recycle-small-img${index}`);

    // Create the new div element
    let newDivElement = document.createElement('div');
    newDivElement.id = `subtask-in-list${index}`; // Preserve the original ID
    newDivElement.innerHTML = /*html*/ `
        <input type="text" id="edited-sub-task-${index}" value="${currentTask.name}">
    `;

    // Replace the original li element with the new div element
    subTaskElement.parentNode.replaceChild(newDivElement, subTaskElement);

    firstButtonImg.src = './img/recycle.svg';
    firstButtonImg.onclick = function () {
        deleteSubtaskHTML(index);
    };

    secondButtonImg.src = './img/check-small.svg';
    secondButtonImg.onclick = function () {
        saveEditedTask(index);
    };

    changeParentStyle(index);
}


/**
 * Saves the edited subtask.
 * @param {number} index - The index of the subtask to save.
 */
function saveEditedTask(index) {
    let editedTaskElement = document.getElementById(`edited-sub-task-${index}`);
    let editedTask = editedTaskElement.value.trim();

    if (editedTask) {
        subTaskList[index].name = editedTask;
        renderSubTaskList();
    } else {
        console.error("Edited subtask is empty");
    }
}


/**
 * Adds a blue line to the currently edited subtask.
 * @param {number} index - The index of the subtask being edited.
 */
function changeParentStyle(index) {
    let childDiv = document.getElementById(`edited-sub-task-${index}`);
    let parentDiv = childDiv.parentElement;

    childDiv.style.borderRadius = '0';
    childDiv.style.backgroundColor = '#ffffff';
    parentDiv.classList.remove('highlight-subtask');
    parentDiv.style.borderBottom = '1px solid #29ABE2';
    parentDiv.style.backgroundColor = '#ffffff';
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
    disableButton();
    document.getElementById('taskForm').reset();

    return false;
}


/**
 * Creates/saves a task in the corresponding list.
 * @param {string} taskTitle - The title of the task from the input field.
 */
async function createTask(taskTitle) {
    let taskDescription = document.getElementById('taskDescription').value;
    let taskDate = document.getElementById('taskDate').value;

    let dataToSend = {
        selectedContacts: selectedContacts,
        subTaskList: subTaskList,
        priority: priority,
        chosenCategory: chosenCategory,
        taskDescription: taskDescription,
        taskDate: taskDate
    };

    let url = BASE_URL + "tasks/" + accName + "/" + boardStatus + "/" + taskTitle + ".json";

    try {
        let response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
            if (window.location.pathname.endsWith("addTask.html")) {
                displayElement('task-scc-add-ntn');
                setTimeout(openBoardPage, 900);
            } else if (window.location.pathname.endsWith("board.html")) {
                load();
                displayNone('addTaskWindow');
            }
        } else {
            console.log("Error creating task.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}