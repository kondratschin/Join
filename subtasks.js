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
    let startIndex = Math.max(0, subTaskList.length - 15); // Start from the last two items or less

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
 * Sends the task data to the server.
 * @param {string} taskTitle - The title of the task from the input field.
 * @param {object} dataToSend - The data object containing task details.
 * @returns {Promise<Response>} The fetch API response.
 */
async function sendTaskData(taskTitle, dataToSend) {
    let url = BASE_URL + "tasks/" + accName + "/" + boardStatus + "/" + taskTitle + ".json";

    try {
        let response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        });

        return response;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Rethrow the error to be handled by the calling function
    }
}


/**
 * Creates the data object to send or store.
 * @param {string} taskTitle - The title of the task.
 * @returns {object} The data object containing task details.
 */
function createTaskData(taskTitle) {
    let taskDescription = document.getElementById('taskDescription').value;
    let taskDate = document.getElementById('taskDate').value;

    return {
        id: taskTitle, // Include the ID only when saving locally
        selectedContacts: selectedContacts,
        subTaskList: subTaskList,
        priority: priority,
        chosenCategory: chosenCategory,
        taskDescription: taskDescription,
        taskDate: taskDate
    };
}


/**
 * Creates/saves a task in the corresponding list.
 * @param {string} taskTitle - The title of the task from the input field.
 */
async function createTask(taskTitle) {
    if (!getName() || getName().trim() === "") {
        createTaskLocally(taskTitle);
        return;
    }

    let dataToSend = createTaskData(taskTitle);

    try {
        let response = await sendTaskData(taskTitle, dataToSend);

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
        // Error already logged in sendTaskData, can handle further if needed
    }
}


/**
 * Creates/saves a task locally in the corresponding list.
 * @param {string} taskTitle - The title of the task from the input field.
 */
function createTaskLocally(taskTitle) {
    let dataToSend = createTaskData(taskTitle);

    // Get the existing tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    tasks[boardStatus] = tasks[boardStatus] || [];
    tasks[boardStatus].push(dataToSend);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    if (window.location.pathname.endsWith("addTask.html")) {
        displayElement('task-scc-add-ntn');
        setTimeout(openBoardPage, 900);
    } else if (window.location.pathname.endsWith("board.html")) {
        load();
        displayNone('addTaskWindow');
    }
}
