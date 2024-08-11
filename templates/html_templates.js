/**
 * Generates the HTML content for a contact.
 * @param {Object} letterContactNr - The contact information.
 * @param {number} y - The index in the sorted list.
 * @param {number} i - The index in the alphabetContainer.
 * @returns {string} - The HTML string for the contact.
 */
function createContactHtml(LetterContactNr, y, i) {
    let color = LetterContactNr['color'];
    let initials = LetterContactNr['name'].match(/\b(\w)/g).join('');
    let name = LetterContactNr['name'];

    return /*html*/ `
        <div onclick="highlightContact(${i}, ${y})" id="contact-in-list${i}-${y}" class="contact-in-list pddng-12">
            <div class="flex-center">
                <div class="initialsContact-small" style="background: ${color}">${initials}</div>
                <span class="pddng-lft-12">${name}</span>
            </div><img id="check-button${i}-${y}" src="./img/check-button.svg" alt="">
            <img id="checked-button${i}-${y}" class="d-none" src="./img/checked-button.svg" alt="">
        </div>
    `;
}


/**
 * Generates the HTML content for the subtask list.
 * @param {Array} subTaskList - The list of subtasks.
 * @param {number} startIndex - The starting index for rendering the list.
 * @returns {string} - The HTML string for the subtask list.
 */
function createSubTaskListHtml(subTaskList, startIndex) {
    let htmlContent = '';

    // Loop through the last two (or less) items in subTaskList
    for (let i = startIndex; i < subTaskList.length; i++) {
        let subTask = subTaskList[i];

        htmlContent += /*html*/ `
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

    return htmlContent;
}


function generateContactsHTML(validContacts) {
    return validContacts.map(contact => `
        <div id="assOverlayAssPerson" class="task-overlay-ass-person">
            <div class="initialsContact-small" style="background: ${contact.color}">
                ${contact.initials}
            </div>
            <span class="pddng-lft-12">${contact.name}</span>
        </div>
    `).join('');
}

function generateSubtasksHTML(subTaskList, taskCategory, taskIndex) {
    return subTaskList.map((subtask, index) => {
        let checkedClass = subtask.complete ? '' : 'd-none';
        let uncheckedClass = subtask.complete ? 'd-none' : '';
        return `
            <div class="subtasks-listed highlight-gray pddng-4" id="subtask${index}">
                <img onclick="checkSubtask('${taskCategory}', ${taskIndex}, ${index})" class="checkbox-subtask ${uncheckedClass}" id="unCheckedButtonOverlay${index}" src="./img/check-button.svg" alt=""> 
                <img onclick="UnCheckSubtask('${taskCategory}', ${taskIndex}, ${index})" id="checkedButtonOverlay${index}" class="${checkedClass} checkbox-subtask" src="./img/checked-button.svg" alt="">
                <span>${subtask.name}</span>
            </div>
        `;
    }).join('');
}

function generateOverlayHeadHTML(task, chosenCategory) {
    return `
        <div class="task-overlay-head">
            <span class="task-overlay-category ${chosenCategory === 'Technical Task' ? 'technical-task' : 'user-story-task'}">${task.chosenCategory}</span> 
            <div onclick="displayNone('task-overlay'); hideBackGrnd('transparentBackGrnd');" class="closeButtonBackground">
                <img src="./img/close.svg" alt="">
            </div>
        </div>
    `;
}

function generateTaskDetailsHTML(task, prioritySVGHTML) {
    return `
        <span id="taskOverlayTitle" class="task-overlay-title">${task.id}</span>
        <span class="task-overlay-text">${task.taskDescription}</span>
        <table class="task-overlay-text">
            <tr>
                <td>Due date:</td>
                <td>${task.taskDate}</td>
            </tr>
            <tr>
                <td>Priority:</td>
                <td class="priority-overlay">${task.priority} ${prioritySVGHTML}</td>
            </tr>
        </table>
    `;
}

function generateContactsSectionHTML(validContacts, contactsHtml) {
    return validContacts.length > 0 ? `
        <div>
            <span class="task-overlay-text">Assigned to:</span>
            <div class="task-overlay-assigned">
                ${contactsHtml}
            </div>
        </div>
    ` : '';
}

function generateSubtasksSectionHTML(hasSubtasks, subtasksHtml) {
    return hasSubtasks ? `
        <div class="d-flex">
            <span class="task-overlay-text subtask-overlay">Subtasks</span>
            <div class="subtasks-list-overlay subtasks-overlay">
                ${subtasksHtml}
            </div>
        </div>
    ` : '';
}

function generateOverlayFooterHTML(task, taskCategory, taskIndex) {
    return `
        <div class="task-overlay-foot">
            <div onclick="deleteTask('${task.id}', '${taskCategory}'); hideBackGrnd('transparentBackGrnd');" class="overlay-action highlight-gray">
                <img id="recycle-small-img" class="plus" src="./img/recycle.svg" alt="">
                <span>Delete</span>
            </div>
            <img src="./img/separator-small.svg" class="sep-small" alt="">
            <div onclick="loadEditTaskOverlay('${taskIndex}', '${taskCategory}', '${task.id}')" class="overlay-action highlight-gray">
                <img id="edit-small-img" class="plus" src="./img/edit-small.svg" alt="">
                <span>Edit</span>
            </div>
        </div>
    `;
}


/**
 * Builds the HTML information for the tasks that are being shown on the board.
 * @param {object} task - The task object containing task details.
 * @param {number} index - The index of the task in the category list.
 * @param {string} taskCategory - The category of the task.
 * @returns {string} - The HTML string for the task.
 */
function buildTaskHTML(task, index, taskCategory) {
    let chosenCategory = task.chosenCategory[0] || 'Default Category';
    let subtasksHTML = getSubtasksHTML(task);
    let contactsHTML = getContactsHTML(task);
    let prioritySVGHTML = getPrioToSVG(task.priority);
    
    return /*html*/ `
    <div draggable="true" ondragend="removeRotation('${taskCategory}', ${index})" ondragstart="startDragging('${taskCategory}', ${index}, '${task.id}')" onclick="renderOverlayTask(${index}, '${taskCategory}', '${chosenCategory}'); showBackGrnd('transparentBackGrnd');" class="taskContainer" id="taskBoard${taskCategory}${index}">
        <div class="task-overlay-head">
            <span class="taskCategory ${chosenCategory === 'Technical Task' ? 'technical-task' : 'user-story-task'}">${chosenCategory}</span>
            <div class="arrows-move-list">
            <div onclick="moveCategoryDown(${index}, '${taskCategory}', '${task.id}')" class="highlight-gray arrow-move"><img src="./img/arrow_drop_down.svg" alt="" style="margin-top: 2px;"></div>
            <div onclick="moveCategoryUp(${index}, '${taskCategory}', '${task.id}')"class="highlight-gray arrow-move"><img src="./img/arrow_drop_down.svg" alt="Arrow" style="transform: rotate(180deg);"></div>
            </div>
        </div>
        <span class="taskTitle">${task.id}</span>
        <span class="taskText">${task.taskDescription}</span>
        ${subtasksHTML}
        <div class="taskFooter">
            <div class="initialLogoContainer">${contactsHTML}</div>
            <div class="priority-icon">${prioritySVGHTML}</div>
        </div>
    </div>`;
}


/**
 * renders the contacts to drop-down list.
 * @param {*} LetterContactNr 
 * @param {*} y 
 * @param {*} i 
 */
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
 * Generates the HTML code for editing a task
 * @param {*} task 
 * @param {*} taskCategory 
 * @returns 
 */
function generateOverlayEdit(task, taskCategory) {

    // Return the final HTML string
    return /*html*/ `
        <form class="task-edit" id="taskEditForm" onsubmit="return saveEditedTaskEvent('${task.id}', '${taskCategory}')">
            <div class="add-task-title edit-task-headline" style="margin-top: 0px !important;">
                <h1>Edit Task</h1>
                <div id="closeTaskButton" onclick="hideAndRemoveEditOverlay(); hideBackGrnd('transparentBackGrnd');" class="closeButtonBackground">
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


/**
 * Generates the HTML for the overlay task.
 * @param {object} task - The task object.
 * @param {array} validContacts - Array of valid contacts.
 * @param {boolean} hasSubtasks - Indicates if the task has subtasks.
 * @param {string} chosenCategory - The chosen category for the task.
 * @param {string} taskCategory - The category of the task.
 * @param {number} taskIndex - The index of the task.
 * @returns {string} - The generated HTML string.
 */
function generateOverlayHTML(task, validContacts, hasSubtasks, chosenCategory, taskCategory, taskIndex) {
    let prioritySVGHTML = getPrioToSVG(task.priority);

    let contactsHtml = generateContactsHTML(validContacts);
    let subtasksHtml = hasSubtasks ? generateSubtasksHTML(task.subTaskList, taskCategory, taskIndex) : '';

    return /*html*/ `
        <div class="task-overlay-wrapper">
            ${generateOverlayHeadHTML(task, chosenCategory)}
            ${generateTaskDetailsHTML(task, prioritySVGHTML)}
            ${generateContactsSectionHTML(validContacts, contactsHtml)}
            ${generateSubtasksSectionHTML(hasSubtasks, subtasksHtml)}
            ${generateOverlayFooterHTML(task, taskCategory, taskIndex)}
        </div>
    `;
}