function processSelectedContacts() {
    // Check if the selectedContacts array exists and has at least one element
    if (selectedContacts && selectedContacts.length > 0) {
        // Iterate over each contact in the selectedContacts array
        selectedContacts.forEach(contact => {
            // Extract and convert i and y from index
            const [i, y] = contact.index.split('-').map(Number);
            // Highlight the contact based on extracted indices
            highlightContactEdit(i, y);
        });
    }
}


function hideAndRemoveEditOverlay() {
    let editTaskForm = document.getElementById('taskEditForm');
    if (editTaskForm) {
        displayNone('editOverlay');
        editTaskForm.parentNode.removeChild(editTaskForm);
    }
}


/**
 * Contacts from array 'selectedContacts' will be shown as selected/highlighted, if no contacts have been selected previously, contact list will be rendered
 */
function showContactDrpEdit() {

    document.getElementById('contact-drp-dwn').classList.toggle('d-none');
    document.getElementById('arrow-drp-dwn').classList.toggle('flip-vertically');

}


/**
 * Contact list from array will be sorted
 */
function createContactDrpDwnEdit() {
    let contactDrpDwn = document.getElementById('contact-content');
    contactDrpDwn.innerHTML = "";

    for (let i = 0; i < alphabetContainer.length; i++) {
        const sortLetterNr = alphabetContainer[i];
        showContactInDrpDwnEdit(sortLetterNr, i);
    }
}


function showContactInDrpDwnEdit(sortLetterNr, i) {
    for (let y = 0; y < sortLetterNr['list'].length; y++) {
        const LetterContactNr = sortLetterNr['list'][y];
        printContactDrpDwnEdit(LetterContactNr, y, i);
    }
}


function printContactDrpDwnEdit(LetterContactNr, y, i) {
    let contactDrpDwn = document.getElementById('contact-content');
    contactDrpDwn.innerHTML += "";
    let color = LetterContactNr['color'];
    let initials = LetterContactNr['name'].match(/\b(\w)/g).join('');
    let name = LetterContactNr['name'];

    contactDrpDwn.innerHTML += /*html*/ `
        <div onclick="highlightContactEdit(${i}, ${y})" id="contact-in-list${i}-${y}" class="contact-in-list pddng-12">
            <div class="flex-center">
                <div class="initialsContact-small" style="background: ${color}">${initials}</div>
                <span class="pddng-lft-12">${name}</span>
            </div><img id="check-button${i}-${y}" src="./img/check-button.svg" alt="">
            <img id="checked-button${i}-${y}" class="d-none" src="./img/checked-button.svg" alt="">
        </div>
    `;
}


/**
 * higlights selected contacts from dropdown list
 * @param {number} i list in json 'alphabetContainer'
 * @param {number} y value from i list in 'alphabetContainer'
 */
function highlightContactEdit(i, y) {
    let contactElement = document.getElementById(`contact-in-list${i}-${y}`);
    
    // Check if the contactElement has the class 'selected-contact'
    if (contactElement.classList.contains('selected-contact')) {
        // If it has the class, remove it
        contactElement.classList.remove('selected-contact');
        removeFromSelectedContactsEdit(i, y);
    } else {
        // If it does not have the class, add it
        contactElement.classList.add('selected-contact');
        addToSelectedContactsEdit(contactElement, i, y);
    }
    
    // Toggle the visibility of the check and checked buttons
    document.getElementById(`checked-button${i}-${y}`).classList.toggle('d-none');
    document.getElementById(`check-button${i}-${y}`).classList.toggle('d-none');
}

/**
 * updates the array 'selectedContacts' with newly selected contacts
 * @param {HTMLElement} contactElement newly selected contact
 * @param {number} i 
 * @param {number} y 
 */
function addToSelectedContactsEdit(contactElement, i, y) {
    const color = contactElement.querySelector('.initialsContact-small').style.background;
    const initials = contactElement.querySelector('.initialsContact-small').innerText;
    const name = contactElement.querySelector('span').innerText;
    const contactIndex = `${i}-${y}`;

    // Check if the contact is already in the selectedContacts array
    const contactExists = selectedContacts.some(contact => contact.index === contactIndex);

    // Only add the contact if it does not already exist in the selectedContacts array
    if (!contactExists) {
        selectedContacts.push({ index: contactIndex, color, initials, name });
        generateAssignedContacts();
    }
}


/**
 * removes the contact from the array 'selectedContacts'
 * @param {HTMLElement} contactElement contact to be removed
 * @param {number} i 
 * @param {number} y 
 */
function removeFromSelectedContactsEdit(i, y) {
    const indexToRemove = `${i}-${y}`;
    selectedContacts = selectedContacts.filter(contact => contact.index !== indexToRemove);

    generateAssignedContacts();
}


function editTaskOverlay(index, taskCategory, taskTitle) {
    displayElement('editOverlay');
    subTaskList = tasks[taskCategory][index].subTaskList || []; // Ensure subTaskList is an array
    let editTaskOverlay = document.getElementById('editOverlay');
    let task = tasks[taskCategory][index];

    selectedContacts = task.selectedContacts || [];

    editTaskOverlay.innerHTML = generateOverlayEdit(task, taskCategory);
    attachEventListeners();
    renderEditSubTaskList();
    createContactDrpDwnEdit();
    task = [];
    processSelectedContacts();
    // Delay execution of loadSelectedInitialIcosEditWindow by 100 milliseconds
    setTimeout(function() {
        generateAssignedContacts();
    }, 100);
}



function generateAssignedContacts() {
    // Get the element where the HTML for the assigned contacts will be placed
    let assignedContactsContainer = document.getElementById('selected-initial-ico');

    // Check if selectedContacts is defined, if not, use an empty array
    let contacts = selectedContacts || [];

    // Initialize an empty string to hold the HTML content
    let assignedContactsHtml = '';

    // Loop through each contact in the contacts array, up to a maximum of 4
    for (let i = 0; i < Math.min(contacts.length, 6); i++) {
        let contact = contacts[i];
        // Create an HTML string for each contact with their initials and background color
        assignedContactsHtml += `
            <div class="initialsContact-small" style="background: ${contact.color}">
                ${contact.initials}
            </div>
        `;
    }

    // If there are more than 6 contacts, add a summary div
    if (contacts.length > 6) {
        let additionalCount = contacts.length - 6;
        assignedContactsHtml += `<div class="initialsContact-small">+${additionalCount}</div>`;
    }

    // Set the innerHTML of the container to the generated HTML
    assignedContactsContainer.innerHTML = assignedContactsHtml;
}


function generateOverlayEdit(task, taskCategory) {

    // Return the final HTML string
    return /*html*/ `
        <form class="task-edit" id="taskEditForm" onsubmit="return saveEditedTaskEvent('${task.id}', '${taskCategory}')">
            <div class="add-task-title edit-task-headline" style="margin-top: 0px !important;">
                <h1>Edit Task</h1>
                <div id="closeTaskButton" onclick="hideAndRemoveEditOverlay()" class="closeButtonBackground">
                    <img src="./img/close.svg" alt="Close">
                </div>
            </div>
    
            <div class="task-edit-wrapper">
                <div class="input-left input-edit">
                    <div class="task-input-field">
                        <span class="input-name">Title<span style="color: red">*</span></span>
                        <div class="error-wrapper">
                            <div class="task-title mrg-bttm-0">
                                <input type="text" id="task-title1" placeholder="Enter a title" title="Please enter at least one word." value="${task.id}">
                            </div>
                            <span id="titleError" class="error d-none">Task title must not be empty</span>
                        </div>
                    </div>
                    <div class="task-input-field">
                        <span class="input-name">Description</span>
                        <div class="task-title task-text">
                            <textarea id="taskDescription" placeholder="Enter a Description">${task.taskDescription}</textarea>
                        </div>
                    </div>
                    <div class="task-input-field margn-btm-32px">
                        <span class="input-name">Assigned to</span>
                        <div id="category-wrapper" class="category-wrapper excludedObject mrg-bttm-8">
                            <div class="contact-list-open">
                                <div onclick="showContactDrpEdit()" id="assign-field" class="category-field">
                                    <div class="assign-contact">
                                        <p id="assigned-contact">Select contacts to assign</p>
                                        <div class="arrow-drp-dwn">
                                            <img id="arrow-drp-dwn" src="./img/arrow_drop_down.svg" alt="Arrow Drop Down">
                                        </div>
                                    </div>
                                </div>
                                <div id="contact-drp-dwn" class="contacts-drp-list d-none">
                                    <div id="contact-content" class="dropdown-category-content"></div>
                                </div>
                            </div>
                        </div>
                        <div id="selected-initial-ico" class="selected-initial-ico">
                            
                        </div>
                    </div>
    
                    <div class="task-input-field">
                        <span class="input-name">Due date<span style="color: red">*</span></span>
                        <div class="error-wrapper">
                            <div class="task-title mrg-bttm-0">
                                <input class="task-date" type="date" id="taskDate" placeholder="dd/mm/yyyy" title="Please enter date" value="${task.taskDate}">
                            </div>
                            <span class="error d-none" id="errorDate">Please select date</span>
                        </div>
                    </div>
                    <div class="task-input-field">
                        <span class="input-name">Prio</span>
                        <div class="prio-buttons">
                            <div onclick="prioritySelected('prio-alta', 'prio-select-red', 'prio-select')" id="prio-alta" class="task-title prio-task prio-alta ${task.priority === 'High' ? 'prio-select-red prio-select' : ''}">
                                <p class="prio-text">Urgent</p>
                                <img src="./img/prio-alta.svg" alt="Urgent Priority">
                            </div>
                            <div onclick="prioritySelected('prio-media', 'prio-select-orange', 'prio-select')" id="prio-media" class="task-title prio-task prio-media ${task.priority === 'Medium' ? 'prio-select-orange prio-select' : ''}">
                                <p class="prio-text">Medium</p>
                                <img src="./img/prio-media.svg" alt="Medium Priority">
                            </div>
                            <div onclick="prioritySelected('prio-baja', 'prio-select-green', 'prio-select')" id="prio-baja" class="task-title prio-task prio-baja ${task.priority === 'Low' ? 'prio-select-green prio-select' : ''}">
                                <p class="prio-text">Low</p>
                                <img src="./img/prio-baja.svg" alt="Low Priority">
                            </div>
                        </div>
                    </div>
                    <div class="task-input-field">
                        <span class="input-name">Category<span style="color: red">*</span></span>
                        <div class="error-wrapper">
                            <div onclick="showCategoryDrp()" class="category-wrapper excludedObject mrg-bttm-0">
                                <div class="contact-list-open">
                                    <div id="category-field" class="category-field">
                                        <div class="assign-contact">
                                            <p id="selected-category">${task.chosenCategory}</p>
                                            <div class="arrow-drp-dwn">
                                                <img id="arrow-drp-dwn2" src="./img/arrow_drop_down.svg" alt="Arrow Drop Down">
                                            </div>
                                        </div>
                                    </div>
                                    <div id="category-drp-dwn" class="contacts-drp-list d-none">
                                        <div class="dropdown-category-content">
                                            <span onclick="assignCategory('Technical Task')" class="pddng-12 highlight-gray">Technical Task</span>
                                            <span onclick="assignCategory('User Story')" class="pddng-12 highlight-gray">User Story</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span id="categoryError" class="error d-none">Please select category</span>
                        </div>
                    </div>
                    <div class="task-input-field">
                        <span class="input-name">Subtask</span>
                        <div class="subtask-wrapper">
                            <div class="task-title excludedObject mrg-bttm-4">
                                <input onfocus="alternateTwoElements('subtask-buttons', 'subtask-plus')" type="text" id="taskSub" placeholder="Add new subtask">
                                <img onclick="pushToEditedSubTaskList()" id="subtask-plus" class="plus mrg-rgt-12" src="./img/plus.svg" alt="Add Subtask">
                                <div id="subtask-buttons" class="sub-task-buttons d-none">
                                    <img onclick="resetInput(); alternateTwoElements('subtask-plus', 'subtask-buttons');" class="plus" src="./img/cross-box-small.svg" alt="Cancel Subtask">
                                    <img src="./img/separator-small.svg" alt="Separator">
                                    <img onclick="pushToEditedSubTaskList()" class="plus" src="./img/check-small.svg" alt="Confirm Subtask">
                                </div>
                            </div>
                            <div id="sub-task-list" class="sub-task-list">
    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="task-lowsection edit-low-section">
                <div class="task-remark" style="font-size: 16px;">
                    <span style="color: red">*</span><span>This field is required</span>
                </div>
                <div class="task-edit-buttons">
                    <button onmousemove="showErrorMsg()" type="submit" disabled id="save-changes-bttn" class="create-task-button">OK<img src="./img/buttonCheck.svg" alt="Button Check"></button>
                </div>
            </div>
        </form>
    `;
}



function renderEditSubTaskList() {
    let subTaskListHTML = document.getElementById('sub-task-list');
    subTaskListHTML.innerHTML = '';

    if (subTaskList && subTaskList.length > 0) { // Check if subTaskList is defined and not empty
        for (let i = 0; i < subTaskList.length; i++) {
            let subTask = subTaskList[i];

            subTaskListHTML.innerHTML += /*html*/ `
                        <div id="sub-task-entry${i}" class="highlight-subtask sub-task-entry">
                            <li id="subtask-in-list${i}">${subTask.name}</li>
                            <div class="sub-task-buttons" style="display: none">
                                <img id="edit-small-img${i}" onclick="editTaskInEditList(${i})" class="plus" src="./img/edit-small.svg" alt="">
                                <img src="./img/separator-small.svg" class="sep-small" alt="">
                                <img id="recycle-small-img${i}" onclick="deleteEditSubtaskHTML(${i})" class="plus" src="./img/recycle.svg" alt="">
                            </div>
                        </div>
                    `;
        }

        // Attach double-click event listeners for the displayed entries
        for (let i = 0; i < subTaskList.length; i++) {
            let subTaskEntry = document.getElementById(`sub-task-entry${i}`);
            subTaskEntry.addEventListener('dblclick', () => {
                editSubTaskInList(subTaskList, i);
            });
        }
    }
}




function editTaskInEditList(index) {
    let subTaskElement = document.getElementById(`subtask-in-list${index}`);
    let currentTask = subTaskList[index];
    let firstButtonImg = document.getElementById(`edit-small-img${index}`);
    let secondButtonImg = document.getElementById(`recycle-small-img${index}`);

    subTaskElement.innerHTML = /*html*/ `
        <input type="text" id="edited-sub-task-${index}" value="${currentTask.name}">
    `;

    firstButtonImg.src = './img/recycle.svg';
    firstButtonImg.onclick = function () {
        deleteEditSubtaskHTML(index);
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
        renderEditSubTaskList();
    } else {
        console.error("Edited subtask is empty");
    }
}


function deleteEditSubtaskHTML(index) {
    subTaskList.splice(index, 1);
    renderEditSubTaskList();
}


function editSubTaskInList(subTaskList, index) {
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
        deleteEditSubtaskHTML(index);
    };

    secondButtonImg.src = './img/check-small.svg';
    secondButtonImg.onclick = function () {
        saveEditedSubTask(subTaskList, index);
    };

    changeParentStyle(index);
}


function saveEditedSubTask(subTaskList, index) {
    let editedTaskElement = document.getElementById(`edited-sub-task-${index}`);
    let editedTask = editedTaskElement.value.trim();

    if (editedTask) {
        subTaskList[index].name = editedTask;
        renderEditSubTaskList(subTaskList);
    } else {
        console.error("Edited subtask is empty");
    }
}


function pushToEditedSubTaskList() {
    let newSubtask = document.getElementById('taskSub').value;

    // Check if newSubtask has at least one character
    if (newSubtask.length >= 1) {
        subTaskList.push({ name: newSubtask, complete: false });
        resetInput();
        alternateTwoElements('subtask-plus', 'subtask-buttons');
        renderEditSubTaskList();
    }
}


// function highlightContactEdit(i, y) {
//     let contactElement = document.getElementById(`contact-in-list${i}-${y}`);
    
//     // Toggle the 'selected-contact' class and determine if the element is selected
//     let isSelected = contactElement.classList.toggle('selected-contact');

//     // Toggle the visibility of buttons
//     document.getElementById(`checked-button${i}-${y}`).classList.toggle('d-none');
//     document.getElementById(`check-button${i}-${y}`).classList.toggle('d-none');

//     // Update selected contacts list
//     // updateSelectedContactsEdit(contactElement, isSelected, i, y);
// }

function updateSelectedContactsEdit(contactElement, isSelected, i, y) {
    const color = contactElement.querySelector('.initialsContact-small').style.background;
    const initials = contactElement.querySelector('.initialsContact-small').innerText;
    const name = contactElement.querySelector('span').innerText;


    if (isSelected) {
        // Add to selectedContacts
        selectedContacts.push({ color, index: `${i}-${y}`, initials, name });
    } else {
        // Remove from selectedContacts
        selectedContacts = selectedContacts.filter(contact => contact.index !== `${i}-${y}`);
    }
}



/**
 * Creates a task in the corresponding list and firebase
 * @param {string} taskTitle is called from the input 
 */
async function saveChangesTask(oldTaskTitle, newTaskTitle, boardStatus) {
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

    let baseUrl = BASE_URL + "tasks/" + accName + "/" + boardStatus + "/";
    let oldTaskUrl = baseUrl + oldTaskTitle + ".json";
    let newTaskUrl = baseUrl + newTaskTitle + ".json";

    try {
        // If the task title has changed, update the Firebase record under the new title and delete the old one
        if (oldTaskTitle !== newTaskTitle) {
            // Save the task data under the new title
            let response = await fetch(newTaskUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                // Delete the old task record
                await fetch(oldTaskUrl, {
                    method: "DELETE"
                });

                // Check the current page and update the UI accordingly
                if (window.location.pathname.endsWith("addTask.html")) {
                    displayElement('task-scc-add-ntn');
                    setTimeout(openBoardPage, 900);
                } else if (window.location.pathname.endsWith("board.html")) {
                    load();
                    displayNone('addTaskWindow');
                }
            } else {
                console.log("Error updating task.");
            }
        } else {
            // If the task title hasn't changed, just update the existing record
            let response = await fetch(newTaskUrl, {
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
        }
    } catch (error) {
        console.error("Error:", error);
    }
}





// Code inside editTask.js
console.log('editTask.js is running');
// Your editTask.js code here

function attachEventListeners() {
    const taskDateInput = document.getElementById('taskDate');
    const taskTitleInput = document.getElementById('task-title1');

    if (taskDateInput) {
        taskDateInput.addEventListener('input', validateDateEdited);
    }

    if (taskTitleInput) {
        taskTitleInput.addEventListener('input', validateTitleEdited);
    }

    // Check if both inputs are not empty when created and validate
    if (taskDateInput && taskTitleInput) {
        validateFormEdited();
    }
}

function validateDateEdited() {
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
    }
    validateFormEdited(); // Call validateFormEdited after validation
}

function validateTitleEdited() {
    const taskTitleInput = document.getElementById('task-title1');
    let errorSpan = document.getElementById('titleError');

    const taskTitle = taskTitleInput.value.trim();

    if (!taskTitle) {
        errorSpan.textContent = "Task title must not be empty.";
    } else {
        errorSpan.textContent = "";
    }
    validateFormEdited(); // Call validateFormEdited after validation
}

function validateFormEdited() {
    const taskDateInput = document.getElementById('taskDate');
    const taskTitleInput = document.getElementById('task-title1');
    const submitButton = document.getElementById('save-changes-bttn');

    if (!taskDateInput || !taskTitleInput) {
        submitButton.disabled = true;
        return;
    }

    const taskDate = new Date(taskDateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskTitle = taskTitleInput.value.trim();

    if (taskTitle && taskDate >= today) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}

// Ensure the functions are available globally if needed
window.attachEventListeners = attachEventListeners;

function saveEditedTaskEvent(oldTaskTitle, taskCategory) {
    let taskTitle = document.getElementById('task-title1').value;
    chosenCategory = [];
    let category = document.getElementById('selected-category').innerText;
    chosenCategory.push(category);
    taskTitle = String(taskTitle);
    saveChangesTask(oldTaskTitle, taskTitle, taskCategory);
    displayNone('task-overlay');
    hideAndRemoveEditOverlay();
    return false;
}
