let selectedContacts = [];
let subTaskList = [];
let priority;
let chosenCategory = [];
let boardStatus = ['toDo']; //defines in which list in the board the task will be put

let statusFromBoard = localStorage.getItem('boardStatus');
if (!statusFromBoard) {
    statusFromBoard = 'toDo'; // Set default status to 'toDo'
}

/**
 * 
 * @param {string} status name of the list in the board
 */
function setBoardStatus(statusFromBoard) {
    boardStatus = statusFromBoard;
    localStorage.removeItem('boardStatus');
}

/**
 * Store the status in localStorage to retrieve it in the addTask.html page
 * @param {string} status 
 */
function openAddTaskPage(status) {
    localStorage.setItem('boardStatus', status);
    window.location.href = 'addTask.html';
}

/**
 * function exists in board.js and must be removed
 * @returns 
 */
function getName(){
    let name = localStorage.getItem('userName');
    return name; // Return the retrieved name
}

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

function monitorInputFieldTitle() {
    let inputField = document.getElementById('task-title1');
    let errorSpan = document.getElementById('titleError');

    inputField.addEventListener('input', function () {
        if (inputField.value.trim() === '') {
            errorSpan.textContent = "Task title must not be empty";
        }
    });
}

function forceDisableButton() {
    let createButton = document.getElementById('create-task-bttn');
    createButton.disabled = true;
}

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


/**
 * Category dropdown will be shown
 */
function showCategoryDrp() {
    document.getElementById('category-drp-dwn').classList.toggle('d-none');
    document.getElementById('arrow-drp-dwn2').classList.toggle('flip-vertically');
}


/**
 *Category dropdown hide
 */
function hideCategoryDrp() {
    document.getElementById('category-drp-dwn').classList.add('d-none');
    document.getElementById('arrow-drp-dwn2').classList.remove('flip-vertically');
}


/**
 *contact dropdown hide
 */
function hideContactDrp() {
    document.getElementById('contact-drp-dwn').classList.add('d-none');
    document.getElementById('arrow-drp-dwn').classList.remove('flip-vertically');
}


/**
 * highlighs the clicked priority button and removes the highlight from other buttons
 * className describes the color with and toggles the color on or off
 * arrow sets the text color to white and also the arrow
 * @param {string} id 
 * @param {string} className 
 * @param {string} arrow 
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
    console.log('Priority Selected:', priority); // Debugging
}


/**
 * removes the highlights
 * @param {string} id 
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
 * higlights selected contacts from dropdown list
 * @param {number} i list in json 'alphabetContainer'
 * @param {number} y value from i list in 'alphabetContainer'
 */
function highlightContact(i, y) {
    const contactElement = document.getElementById(`contact-in-list${i}-${y}`);
    const isSelected = contactElement.classList.toggle('selected-contact');

    document.getElementById(`checked-button${i}-${y}`).classList.toggle('d-none');
    document.getElementById(`check-button${i}-${y}`).classList.toggle('d-none');

    updateSelectedContacts(contactElement, isSelected, i, y);
}


/**
 * updates the array 'selectedContacts' wiht newly selected contacts
 * @param {string} contactElement newli selected contact
 * @param {string} isSelected 
 * @param {number} i 
 * @param {number} y 
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


function toggleTwoElements(one, two) {
    document.getElementById(`${one}`).classList.toggle('d-none');
    document.getElementById(`${two}`).classList.toggle('d-none');
}


/**
 * removes display: none from one and adds display: none to two
 * @param {string} one 
 * @param {string} two 
 */
function alternateTwoElements(one, two) {
    document.getElementById(`${one}`).classList.remove('d-none');
    document.getElementById(`${two}`).classList.add('d-none');
}

/**
 * Disable submit button and clear fields
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
    chosenCategory = [];
    chosenCategory.push(category);
    validateForm();
}

/**
 * Load contacts from Firebase into array
 */
async function loadContactsArray() {

    let response = await fetch(BASE_URL + "contacts/" + accName + ".json");
    let responseAsJson = await response.json();
    let contactsAsArray = Object.keys(responseAsJson);
    sortContactlist(responseAsJson, contactsAsArray);
    createContactDrpDwn();
    selectedInitialIcos();
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
        printContactDrpDwn(LetterContactNr, y, i);
    }
}

function printContactDrpDwn(LetterContactNr, y, i) {
    let contactDrpDwn = document.getElementById('contact-content');
    contactDrpDwn.innerHTML += "";
    let color = LetterContactNr['color'];
    let initials = LetterContactNr['name'].match(/\b(\w)/g).join('');
    let name = LetterContactNr['name'];

    contactDrpDwn.innerHTML += /*html*/ `
        <div onclick="highlightContact(${i}, ${y})" id="contact-in-list${i}-${y}" class="contact-in-list pddng-12">
            <div class="flex-center">
                <div class="initialsContact-small" style="background: ${color}">${initials}</div>
                <span class="pddng-lft-12">${name}</span>
            </div><img id="check-button${i}-${y}" src="./img/check-button.svg" alt="">
            <img id="checked-button${i}-${y}" class="d-none" src="./img/checked-button.svg" alt="">
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

    // Check if newSubtask has at least one character
    if (newSubtask.length >= 1) {
        subTaskList.push({ name: newSubtask, complete: false });
        resetInput();
        alternateTwoElements('subtask-plus', 'subtask-buttons');
        renderSubTaskList();
    }
}

function renderSubTaskList() {
    let subTaskListHTML = document.getElementById('sub-task-list');
    subTaskListHTML.innerHTML = '';

    // Determine the starting index based on the length of subTaskList
    let startIndex = Math.max(0, subTaskList.length - 2); // Start from the last two items or less

    // Loop through the last two (or less) items in subTaskList
    for (let i = startIndex; i < subTaskList.length; i++) {
        let subTask = subTaskList[i];

        subTaskListHTML.innerHTML += /*html*/ `
            <div id="sub-task-entry${i}" class="highlight-subtask sub-task-entry">
                <li id="subtask-in-list${i}">${subTask.name}</li>
                <div class="sub-task-buttons" style="display: none">
                    <img id="edit-small-img${i}" onclick="editTaskInList(${i})" class="plus" src="./img/edit-small.svg" alt="">
                    <img src="./img/separator-small.svg" class="sep-small" alt="">
                    <img id="recycle-small-img${i}" onclick="deleteSubtaskHTML(${i})" class="plus" src="./img/recycle.svg" alt="">
                </div>
            </div>
        `;
    }

    // Attach double-click event listeners for the displayed entries
    for (let i = startIndex; i < subTaskList.length; i++) {
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
    let subTaskElement = document.getElementById(`subtask-in-list${index}`);
    let currentTask = subTaskList[index];
    let firstButtonImg = document.getElementById(`edit-small-img${index}`);
    let secondButtonImg = document.getElementById(`recycle-small-img${index}`);

    subTaskElement.innerHTML = /*html*/ `
        <input type="text" id="edited-sub-task-${index}" value="${currentTask.name}">
    `;

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

function changeParentStyle(index) {
    let childDiv = document.getElementById(`subtask-in-list${index}`);
    let parentDiv = childDiv.parentElement;

    childDiv.style.borderRadius = '0';
    childDiv.style.backgroundColor = '#ffffff';
    parentDiv.classList.remove('highlight-subtask');
    parentDiv.style.borderBottom = '1px solid #29ABE2';
    parentDiv.style.backgroundColor = '#ffffff';
}

function openBoardPage() {
    window.location.href = './board.html';
}

function addTaskEvent() {
    let taskTitle = document.getElementById('task-title1').value;
    taskTitle = String(taskTitle);
    createTask(taskTitle);
    disableButton();
    document.getElementById('taskForm').reset();

    return false;
}

/**
 * Creates/saves a task in the corresponding list
 * @param {string} taskTitle is called from the input field
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



