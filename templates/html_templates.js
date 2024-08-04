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
            <div onclick="deleteTask('${task.id}', '${taskCategory}')" class="overlay-action highlight-gray">
                <img id="recycle-small-img" class="plus" src="./img/recycle.svg" alt="">
                <span>Delete</span>
            </div>
            <img src="./img/separator-small.svg" class="sep-small" alt="">
            <div onclick="loadEditTaskScriptAndRunOverlay('${taskIndex}', '${taskCategory}', '${task.id}')" class="overlay-action highlight-gray">
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