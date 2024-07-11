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

function editTaskOverlay(index, taskCategory = 'toDo', chosenCategory) {
    displayElement('editOverlay');
    let editTaskOverlay = document.getElementById('editOverlay');
    const tasksInCategory = tasks[taskCategory]; // Get tasks from the specified category

    if (index >= 0 && index < tasksInCategory.length) {
        let task = tasksInCategory[index]; // Access the specific task by index
        loadContactsArray();
        selectedContacts = task.selectedContacts || [];
        let hasSubtasks = task.subTaskList && task.subTaskList.length > 0;

        editTaskOverlay.innerHTML = generateOverlayEdit(task, hasSubtasks, chosenCategory, taskCategory, index);

    } else {
        editTaskOverlay.innerHTML = "<p>No tasks available in this category or invalid index.</p>";
    }
}

function generateOverlayEdit(task, hasSubtasks, chosenCategory, taskCategory, index) {
    const assignedContactsHtml = (task.assignedContacts || []).map(contact => `
        <div class="initialsContact-small" style="background: ${contact.color}">${contact.initials}</div>
    `).join('');

    const subTaskListHtml = (task.subTaskList || []).map((subtask, i) => `
        <div class="subtasks-listed highlight-gray pddng-4" id="subtask${i}">
            <img onclick="checkSubtask('${taskCategory}', ${index}, ${i})" class="checkbox-subtask ${subtask.complete ? '' : 'd-none'}" id="unCheckedButtonOverlay${i}" src="./img/check-button.svg" alt="Check Subtask">
            <img onclick="UnCheckSubtask('${taskCategory}', ${index}, ${i})" id="checkedButtonOverlay${i}" class="${subtask.complete ? 'd-none' : ''} checkbox-subtask" src="./img/checked-button.svg" alt="Uncheck Subtask">
            <span>${subtask.name}</span>
        </div>
    `).join('');

    return /*html*/ `
    <form class="task-edit" id="taskForm" onsubmit="return addTaskEvent()">
        <div class="add-task-title edit-task-headline" style="margin-top: 0px !important;">
            <h1>Edit Task</h1>
            <div id="closeTaskButton" onclick="displayNone('editOverlay')" class="closeButtonBackground">
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
                <div class="task-input-field">
                    <span class="input-name">Assigned to</span>

                    <div id="category-wrapper" class="category-wrapper excludedObject mrg-bttm-8">
                        <div class="contact-list-open">
                            <div onclick="showContactDrp(), processSelectedContacts();" id="assign-field" class="category-field">
                                <div class="assign-contact">
                                    <p id="assigned-contact">Select contacts to assign</p>
                                    <div class="arrow-drp-dwn">
                                        <img id="arrow-drp-dwn" src="./img/arrow_drop_down.svg" alt="Arrow Drop Down">
                                    </div>
                                </div>
                            </div>
                            <div id="contact-drp-dwn" class="contacts-drp-list d-none">
                                <div id="contact-content" class="dropdown-category-content">

                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="selected-initial-ico" class="selected-initial-ico">
                        ${assignedContactsHtml}
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
                        <div onclick="prioritySelected('prio-alta', 'prio-select-red', 'prio-select')" id="prio-alta" class="task-title prio-task prio-alta ${task.priority === 'Urgent' ? 'prio-select-red' : ''}">
                            <p class="prio-text">Urgent</p>
                            <img src="./img/prio-alta.svg" alt="Urgent Priority">
                        </div>
                        <div onclick="prioritySelected('prio-media', 'prio-select-orange', 'prio-select')" id="prio-media" class="task-title prio-task prio-media ${task.priority === 'Medium' ? 'prio-select-orange' : ''}">
                            <p class="prio-text">Medium</p>
                            <img src="./img/prio-media.svg" alt="Medium Priority">
                        </div>
                        <div onclick="prioritySelected('prio-baja', 'prio-select-green', 'prio-select')" id="prio-baja" class="task-title prio-task prio-baja ${task.priority === 'Low' ? 'prio-select-green' : ''}">
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
                            <img onclick="pushToSubTaskList()" id="subtask-plus" class="plus mrg-rgt-12" src="./img/plus.svg" alt="Add Subtask">
                            <div id="subtask-buttons" class="sub-task-buttons d-none">
                                <img onclick="resetInput(); alternateTwoElements('subtask-plus', 'subtask-buttons');" class="plus" src="./img/cross-box-small.svg" alt="Cancel Subtask">
                                <img src="./img/separator-small.svg" alt="Separator">
                                <img onclick="pushToSubTaskList()" class="plus" src="./img/check-small.svg" alt="Confirm Subtask">
                            </div>
                        </div>
                        <div id="sub-task-list" class="sub-task-list">
                            ${subTaskListHtml}
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


function highlightContactEdit(i, y) {
    const contactElement = document.getElementById(`contact-in-list${i}-${y}`);
    const isSelected = contactElement.classList.toggle('selected-contact');

    document.getElementById(`checked-button${i}-${y}`).classList.toggle('d-none');
    document.getElementById(`check-button${i}-${y}`).classList.toggle('d-none');

    // updateSelectedContactsEdit(contactElement, isSelected, i, y);
}

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
    selectedInitialIcos();
}



/**
 * Opens a new window with an editable form for the task details
 * @param {number} index - The index of the task in the category array
 * @param {string} taskCategory - The category of the task (e.g., 'toDo', 'inProgress')
 */
function renderEditableOverlayTask(index, taskCategory = 'toDo') {
    let tasksInCategory = tasks[taskCategory];

    if (index < 0 || index >= tasksInCategory.length) {
        alert("Invalid task index.");
        return;
    }

    let task = tasksInCategory[index];
    displayElement('editOverlay');
    let editTaskOverlay = document.getElementById('editOverlay');
    editTaskOverlay.innerHTML = `
        <h1>Edit Task</h1>
        <form id="editTaskForm">
            <label for="taskId">Task ID:</label>
            <input type="text" id="taskId" name="taskId" value="${task.id}" readonly>

            <label for="taskDescription">Task Description:</label>
            <textarea id="taskDescription" name="taskDescription">${task.taskDescription}</textarea>

            <label for="taskDate">Due Date:</label>
            <input type="date" id="taskDate" name="taskDate" value="${task.taskDate}">

            <label for="taskPriority">Priority:</label>
            <select id="taskPriority" name="taskPriority">
                <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
                <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
            </select>

            <label for="taskContacts">Assigned Contacts:</label>
            <input type="text" id="taskContacts" name="taskContacts" value="${task.selectedContacts.map(contact => contact.name).join(', ')}">

            <label for="taskSubtasks">Subtasks (comma-separated):</label>
            <input type="text" id="taskSubtasks" name="taskSubtasks" value="${task.subTaskList.map(subtask => subtask.name).join(', ')}">

            <button type="button" onclick="saveTask(${index}, '${taskCategory}')">Save</button>
        </form>
    `;
}
