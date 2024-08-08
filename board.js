let tasks = {
    toDo: [],
    inProgress: [],
    awaitFeedback: [],
    done: []
};


let currentDraggedElement;


/**
 * Retrieves the user name of the logged-in user.
 * @returns {string} The user name of the logged-in user.
 */
function getName() {
    let name = localStorage.getItem('userName');
    return name; // Return the retrieved name
}


/**
 * Loads contact data into temporary arrays, fetches the tasks from Firebase, and renders lists when the page is loaded.
 */
function load() {
    if (!getName()) {
        loadGuest();
    } else {
        loadContactsArrayBoard();
        addPlus();
        getTasks().then(() => {
            renderToDoList();
            checkArraysForContent();
        }).catch((error) => {
            console.error('There was an issue loading tasks:', error);
        });
    }
}


/**
 * Loads contact data into temporary arrays, fetches the tasks from local storage, and renders lists when the page is loaded.
 */
function loadGuest() {
    // loadJSONDataContacts();
    addPlus();
    loadJSONDataTasks();
    }


/**
 * Load contacts from Firebase into array, if guest than local json
 */
async function loadContactsArrayBoard() {
    let accName = getName();
    
    if (!accName) {
        loadJSONDataContacts();
    } else {
        try {
            let response = await fetch(BASE_URL + "contacts/" + accName + ".json");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let responseAsJson = await response.json();
            let contactsAsArray = Object.keys(responseAsJson);
            sortContactlist(responseAsJson, contactsAsArray);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
}


/**
 * Fetches the tasks from Firebase or loads JSON data if getName is null or empty.
 */
async function getTasks() {
    let categories = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    let name = getName();
  
    if (!name) {
      loadJSONDataTasks();
      return;
    }
  
    for (let category of categories) {
      try {
        let response = await fetch(`${BASE_URL}tasks/${name}/${category}.json`);
        let data = await response.json();
  
        if (data) {
          tasks[category] = Object.keys(data).map(key => ({
            ...data[key],
            id: key,
            category
          }));
        }
      } catch (error) {
        console.error(`Error fetching tasks for ${category}:`, error);
      }
    }
  }
  
  

/**
 * Shows a pop-up screen with task details.
 * @param {number} index - The index of the task in the specified category.
 * @param {string} taskCategory - The category of the task.
 * @param {string} chosenCategory - The chosen category for the task.
 */
function renderOverlayTask(index, taskCategory = 'toDo', chosenCategory) {
    displayElement('task-overlay');
    let content = document.getElementById('task-overlay');
    let tasksInCategory = tasks[taskCategory]; // Get tasks from the specified category

    if (index >= 0 && index < tasksInCategory.length) {
        let task = tasksInCategory[index]; // Access the specific task by index

        let selectedContacts = task.selectedContacts || [];
        let hasSubtasks = task.subTaskList && task.subTaskList.length > 0;

        // Filter out undefined contacts
        let validContacts = selectedContacts.filter(contact => contact !== undefined && contact !== null);

        // Generate HTML and update content
        content.innerHTML = generateOverlayHTML(task, validContacts, hasSubtasks, chosenCategory, taskCategory, index);
        // setTimeout(adjustFontSizeOverlay, 100); removed function
    } else {
        content.innerHTML = "<p>No tasks available in this category or invalid index.</p>";
    }
}


/**
 * Checks a subtask as done, sets the tick, and updates the Firebase data.
 * @param {string} taskCategory - The category of the task.
 * @param {number} taskIndex - The index of the task in the category.
 * @param {number} subtaskIndex - The index of the subtask in the task.
 */
async function checkSubtask(taskCategory, taskIndex, subtaskIndex) {
    document.getElementById(`unCheckedButtonOverlay${subtaskIndex}`).classList.add('d-none');
    document.getElementById(`checkedButtonOverlay${subtaskIndex}`).classList.remove('d-none');
    tasks[taskCategory][taskIndex].subTaskList[subtaskIndex].complete = true;

    await updateSubtaskInFirebase(taskCategory, taskIndex, subtaskIndex, true);
    load();
}


/**
 * Checks a subtask as undone, removes the tick, and updates the Firebase data.
 * @param {string} taskCategory - The category of the task.
 * @param {number} taskIndex - The index of the task in the category.
 * @param {number} subtaskIndex - The index of the subtask in the task.
 */
async function UnCheckSubtask(taskCategory, taskIndex, subtaskIndex) {
    document.getElementById(`checkedButtonOverlay${subtaskIndex}`).classList.add('d-none');
    document.getElementById(`unCheckedButtonOverlay${subtaskIndex}`).classList.remove('d-none');
    tasks[taskCategory][taskIndex].subTaskList[subtaskIndex].complete = false;

    // Update Firebase
    await updateSubtaskInFirebase(taskCategory, taskIndex, subtaskIndex, false);
    load();
    }


/**
 * Updates the subtasks in Firebase.
 * @param {string} taskCategory - The category of the task.
 * @param {number} taskIndex - The index of the task in the category.
 * @param {number} subtaskIndex - The index of the subtask in the task.
 * @param {boolean} complete - The completion status of the subtask.
 */
async function updateSubtaskInFirebase(taskCategory, taskIndex, subtaskIndex, complete) {
    const task = tasks[taskCategory][taskIndex];
    const userName = getName();
    const url = `${BASE_URL}tasks/${userName}/${taskCategory}/${task.id}/subTaskList/${subtaskIndex}.json`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...task.subTaskList[subtaskIndex], complete })
        });

        if (!response.ok) {
            throw new Error(`Failed to update subtask with status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error updating subtask:", error);
    }
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


/**
 * Shows a black transparent background if an overlay is being shown.
 * @param {string} targetId - The ID of the target element.
 */
function showBackGrnd(targetId) {
    displayElement(targetId);
    let targetElement = document.getElementById(targetId);
    if (targetElement) {
        let parentElement = targetElement.parentElement;
        if (parentElement) {
            parentElement.style.overflow = 'hidden';
        } else {
            console.error('Parent element not found.');
        }
    } else {
        console.error('Target element not found.');
    }
}


/**
 * Removes black background if overlay is being closed.
 * @param {string} targetId - The ID of the target element.
 */
function hideBackGrnd(targetId) {
    displayNone(targetId);
    let targetElement = document.getElementById(targetId);
    if (targetElement) {
        let parentElement = targetElement.parentElement;
        if (parentElement) {
            parentElement.style.overflow = '';
        } else {
            console.error('Parent element not found.');
        }
    } else {
        console.error('Target element not found.');
    }
}


/**
 * Updates the task in the main application and re-renders the task list
 * @param {number} index - The index of the task in the category array
 * @param {string} taskCategory - The category of the task (e.g., 'toDo', 'inProgress')
 * @param {object} updatedTask - The updated task object
 */
function updateTask(index, taskCategory, updatedTask) {
    tasks[taskCategory][index] = updatedTask;
    renderToDoList();
    checkArraysForContent();
}


/**
 * Renders the tasks in the list.
 */
function renderToDoList() {
    let categories = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    categories.forEach(renderList);
}


/**
 * Checks if content is available; otherwise, the placeholder will be shown.
 */
function checkArraysForContent() {
    const categories = [
        { key: 'toDo', placeholderId: 'todoPlaceholder' },
        { key: 'inProgress', placeholderId: 'progressPlaceholder' },
        { key: 'awaitFeedback', placeholderId: 'feedbackPlaceholder' },
        { key: 'done', placeholderId: 'donePlaceholder' }
    ];

    categories.forEach(category => {
        const placeholder = document.getElementById(category.placeholderId);
        const visibleTasks = document.querySelectorAll(`.${category.key}Container .taskContainer:not(.d-none)`);

        if (visibleTasks.length === 0) {
            placeholder.classList.remove('d-none'); // Show the placeholder if no tasks are visible
        } else {
            placeholder.classList.add('d-none'); // Hide the placeholder if tasks are present
        }
    });
}


/**
 * Looks up the assigned contacts for the task.
 * @param {object} task - The task object containing task details.
 * @returns {object} - The first selected contact or a default contact object if none are selected.
 */
function getSelectedContact(task) {
    return Array.isArray(task.selectedContacts) && task.selectedContacts.length > 0
        ? task.selectedContacts[0]
        : { color: '#ccc', initials: '', name: 'Unknown' };
}


/**
 * Shows the progress of the subtasks and the completed count.
 * @param {object} task - The task object containing subtask details.
 * @returns {string} - The HTML string for the subtasks progress or an empty string if there are no subtasks.
 */
function getSubtasksHTML(task) {
    if (task.subTaskList && task.subTaskList.length > 0) {
        let completedCount = task.subTaskList.filter(subtask => subtask.complete).length;
        let total = task.subTaskList.length;
        let progressPercent = (completedCount / total) * 100;

        return /*html*/ `
        <div class="subTaskContainer">
            <div class="progress">
                <div class="progress-bar" style="width: ${progressPercent}%;"></div>
            </div>
            <span>${completedCount}/${total} Subtasks</span>
        </div>`;
    }
    return '';
}


/**
 * Shows the assigned contacts and adds a small icon if more than 4 contacts are selected.
 * @param {object} task - The task object containing contact details.
 * @returns {string} - The HTML string for the contacts.
 */
function getContactsHTML(task) {
    let htmlContent = '';

    if (Array.isArray(task.selectedContacts)) {
        let numberOfContacts = task.selectedContacts.length;

        for (let i = 0; i < Math.min(numberOfContacts, 4); i++) {
            let contact = task.selectedContacts[i];
            
            htmlContent += `
                <div class="initialsContact-small margin-left-10" style="background: ${contact.color}">
                    ${contact.initials}
                </div>`;
        }

        if (numberOfContacts > 4) {
            let additionalCount = numberOfContacts - 4;
            htmlContent += `<div class="initialsContact-small margin-left-10">+${additionalCount}</div>`;
        }
    }

    return htmlContent;
}


/**
 * Renders the tasks into each list.
 * @param {string} taskCategory - The category of tasks to render.
 */
function renderList(taskCategory) {
    let content = document.getElementById(`${taskCategory}List`);
    let tasksInCategory = tasks[taskCategory];
    let htmlContent = '';

    for (let i = 0; i < tasksInCategory.length; i++) {
        let task = tasksInCategory[i];
        htmlContent += buildTaskHTML(task, i, taskCategory);
    }

    content.innerHTML = htmlContent;
}


function renderLocalTasks() {
    renderList('toDo');
    renderList('inProgress');
    renderList('awaitFeedback');
    renderList('done');
    checkArraysForContent();
}

/**
 * Creates the correct priority symbol based on priority.
 * @param {string} priority - The priority level of the task.
 * @returns {string} - The HTML string for the priority symbol.
 */
function getPrioToSVG(priority) {
    switch (priority) {
        case 'High':
            return `<img src="./img/prio-alta.svg" width="21" height="16" class="prio-red" alt="High Priority">`;
        case 'Medium':
            return `<img src="./img/prio-media.svg" width="21" height="8" class="prio-orange" alt="Medium Priority">`;
        case 'Low':
            return `<img src="./img/prio-baja.svg" width="21" height="16" class="prio-green" alt="Low Priority">`;
        default:
            return ''; 
    }
}


/**
 * Creates the add task button.
 */
function addPlus() {
    const addButton = document.getElementById('addTaskButton');
    // Check if the plus symbol already exists
    if (!addButton.querySelector('.add')) {
        addButton.innerHTML += `<img class="add" src="./img/add.svg" alt="Add">`;
    }
}


/**
 * Deletes the task, either locally or from Firebase.
 * @param {string} taskId - The ID of the task to delete.
 * @param {string} taskCategory - The category of the task.
 */
async function deleteTask(taskId, taskCategory) {
    const userName = getName();
    if (!userName) {
        deleteTaskLocally(taskId, taskCategory);
        return;
    }

    const url = `${BASE_URL}tasks/${userName}/${taskCategory}/${taskId}.json`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            removeTaskFromUI(taskId, taskCategory);
        } else {
            throw new Error(`Failed to delete task with status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}


/**
 * Deletes the task from local storage.
 * @param {string} taskId - The ID of the task to delete.
 * @param {string} taskCategory - The category of the task.
 */
function deleteTaskLocally(taskId, taskCategory) {
    // Retrieve the tasks from local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};

    // Find and remove the task from the appropriate category
    if (tasks[taskCategory]) {
        const updatedTasks = tasks[taskCategory].filter(task => task.id !== taskId);
        tasks[taskCategory] = updatedTasks;

        // Save the updated tasks back to local storage
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Remove the task from the UI
        removeTaskFromUI(taskId, taskCategory);
    } else {
        console.error(`Task category '${taskCategory}' not found.`);
    }
}


/**
 * Removes the task from the board.
 * @param {string} taskId - The ID of the task to remove.
 * @param {string} taskCategory - The category of the task.
 */
function removeTaskFromUI(taskId, taskCategory) {
    tasks[taskCategory] = tasks[taskCategory].filter(task => task.id !== taskId);
    renderList(taskCategory);
    load();
    displayNone('task-overlay')
}


/**
 * Filters the tasks according to the search text.
 */
function findTask() {
    let input = document.getElementById('findTaskInput').value.trim().toLowerCase(); // Trim the input and convert to lowercase

    let found = false;
    const taskContainers = document.querySelectorAll('.taskContainer'); // Assuming your task elements have this class

    taskContainers.forEach(container => {
        const taskDescription = container.querySelector('.taskText').textContent.toLowerCase(); // Text of the task description element
        const taskTitle = container.querySelector('.taskTitle').textContent.toLowerCase(); // Text of the task title element
        if (taskDescription.includes(input) || taskTitle.includes(input)) {
            container.classList.remove('d-none');
            found = true;
        } else {
            container.classList.add('d-none');
        }
    });

    if (!found) {
        console.log('No task found with this text.');
    }

    checkArraysForContent();
}


/**
 * Allows dragging of tasks from one list to another.
 * @param {string} currentCategory - The current category of the task.
 * @param {number} index - The index of the task in the current category.
 * @param {string} taskTitle - The title of the task.
 */
function startDragging(currentCategory, index, taskTitle) {
    currentDraggedElement = [index, currentCategory, taskTitle];
      // add class with rotation
  document.getElementById(`taskBoard${currentCategory}${index}`).classList.add("rotate");
}


/**
 * Removes the CSS class that rotates the task by a small degree.
 */
function removeRotation() {
    // Select all elements with the class 'rotate'
    const elements = document.querySelectorAll('.rotate');
    
    // Loop through each element and remove the class 'rotate'
    elements.forEach(element => {
        element.classList.remove('rotate');
    });
}


let lists = ["doneContainer", "inProgressContainer", "toDoContainer", "awaitFeedbackContainer"];


/**
 * Adds a dotted line to the specified list and removes it from other lists.
 * @param {string} listName - The name of the list to highlight.
 */
function addDottedLine(listName) {
    document.getElementById(`${listName}Container`).classList.add("highlightBorder");
    removeDottedLine(listName);
}


/**
 * Removes dotted lines from all lists except the specified one.
 * @param {string} listName - The name of the list to keep highlighted.
 */
function removeDottedLine(listName) {
    lists.forEach(list => {
        if (list !== `${listName}Container`) {
            document.getElementById(list).classList.remove("highlightBorder");
        }
    });
}


/**
 * Removes all dotted lines if dropped somewhere else as specified.
 */
function removeAllDottedLines() {
    lists.forEach(list => {
        document.getElementById(list).classList.remove("highlightBorder");
    });
}


/**
 * Moves the task to the category list below the current one.
 * @param {number} index - The index of the task in the current category.
 * @param {string} currentCategory - The current category of the task.
 * @param {string} taskTitle - The title of the task.
 * @returns {void}
 */
async function moveCategoryDown(index, currentCategory, taskTitle) {
    event.stopPropagation();
    if (currentCategory === 'done') {
        return; // Stop the function and do nothing
    }
    let newCategory;

    if (currentCategory === 'toDo') {
        newCategory = 'inProgress';
    } else if (currentCategory === 'inProgress') {
        newCategory = 'awaitFeedback';
    } else if (currentCategory === 'awaitFeedback') {
        newCategory = 'done';
    }

    // Move the task locally and update UI
    moveToCategory(newCategory, index, currentCategory, taskTitle);
    renderToDoList();
    checkArraysForContent();
    
    try {
        // Update Firebase after local move
        await updateFirebase(newCategory, index, currentCategory, taskTitle);

    } catch (error) {
        console.error("Error moving task:", error);
    }
}


/**
 * Moves the task to the category list above the current one.
 * @param {number} index - The index of the task in the current category.
 * @param {string} currentCategory - The current category of the task.
 * @param {string} taskTitle - The title of the task.
 * @returns {void}
 */
async function moveCategoryUp(index, currentCategory, taskTitle) {
    event.stopPropagation();
    if (currentCategory === 'toDo') {
        return; // Stop the function and do nothing
    }
    let newCategory;

    if (currentCategory === 'done') {
        newCategory = 'awaitFeedback';
    } else if (currentCategory === 'awaitFeedback') {
        newCategory = 'inProgress';
    } else if (currentCategory === 'inProgress') {
        newCategory = 'toDo';
    }

    // Move the task locally and update UI
    moveToCategory(newCategory, index, currentCategory, taskTitle);
    renderToDoList();
    checkArraysForContent();
    
    try {
        // Update Firebase after local move
        await updateFirebase(newCategory, index, currentCategory, taskTitle);
        console.log(`Task successfully moved to ${newCategory}`);
    } catch (error) {
        console.error("Error moving task:", error);
    }
}


/**
 * Moves the task to the specified category list.
 * @param {string} category - The target category to move the task to.
 * @returns {Promise<void>}
 */
async function moveTo(category) {
    let [index, currentCategory, taskTitle] = currentDraggedElement;
    
    // Move the task locally and update UI
    moveToCategory(category, index, currentCategory, taskTitle);
    renderToDoList();
    checkArraysForContent();
    
    try {
        // Update Firebase after local move
        await updateFirebase(category, index, currentCategory, taskTitle);
        console.log(`Task successfully moved to ${category}`);
    } catch (error) {
        console.error("Error moving task:", error);
    }
}


/**
 * Allows drag-and-drop operations by preventing the default behavior of the event.
 * @param {Event} ev - The dragover event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * Moves a task to a new category while removing it from the old one.
 * @param {string} category - The new category where the task should be moved.
 * @param {number} index - The index position where the task should be inserted in the new category.
 * @param {string} currentCategory - The current category from which the task is being moved.
 * @param {string} taskTitle - The ID of the task being moved.
 */
function moveToCategory(category, index, currentCategory, taskTitle) {
    let taskIndex = tasks[currentCategory].findIndex(task => task.id === taskTitle);
    
    if (taskIndex === -1) {
        console.error(`Task with id ${taskTitle} not found in ${currentCategory}`);
        return;
    }
    
    // Remove the task from its current category array
    let [task] = tasks[currentCategory].splice(taskIndex, 1);
    
    // Update the task's category field
    task.category = category;
    
    // Add the task to the new category array at the specified index
    tasks[category].splice(index, 0, task);
}


/**
 * Updates Firebase with the task's new category and removes it from the old category.
 * @param {string} category - The new category where the task should be moved.
 * @param {number} index - The index position where the task should be inserted in the new category.
 * @param {string} currentCategory - The current category from which the task is being moved.
 * @param {string} taskTitle - The ID of the task being moved.
 */
async function updateFirebase(category, index, currentCategory, taskTitle) {
    try {
        // Delete the task from the current category in Firebase
        await fetch(`${BASE_URL}tasks/${getName()}/${currentCategory}/${taskTitle}.json`, {
            method: 'DELETE'
        });
        
        // Add the task to the new category in Firebase with the same taskTitle
        let task = tasks[category].find(task => task.id === taskTitle);
        await fetch(`${BASE_URL}tasks/${getName()}/${category}/${taskTitle}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });

    } catch (error) {
        console.error("Error moving task:", error);
    }
}


/**
 * Loads the editTask.js file to prevent unexpected behavior if tasks are not being edited.
 * @param {Function} callback - The function to be executed once the script is loaded.
 */
function loadEditTaskScript(callback) {
    // Check if the script is already loaded
    if (!document.getElementById('editTaskScript')) {
        const script = document.createElement('script');
        script.src = './editTask.js';
        script.id = 'editTaskScript';
        script.onload = callback;
        document.body.appendChild(script);
    } else {
        // Script is already loaded, just call the callback
        callback();
    }
}


/**
 * Loads editTask.js and shows the edit overlay for tasks, hides the task overlay and removes the HTML content to avoid unexpected behavior.
 * @param {number} taskIndex - The index of the task in its category.
 * @param {string} taskCategory - The category of the task (e.g., 'toDo', 'inProgress', etc.).
 * @param {string} taskTitle - The title or ID of the task being edited.
 */
function loadEditTaskScriptAndRunOverlay(taskIndex, taskCategory, taskTitle) {
    loadEditTaskScript(() => {
        if (typeof editTaskOverlay === 'function') {
            editTaskOverlay(taskIndex, taskCategory, taskTitle);
        }
    });
    hideAndRemoveTaskOverlay();
}


/**
 * Defines in which column the task will be saved.
 * @param {string} status - The name of the column.
 */
function addTaskWindow(status) {
    setBoardStatus(status);
    displayElement('addTaskWindow');
    priority = "";
    loadContactsArray();
}


/**
 * Hides the task overlay and removes the HTML content.
 */
function hideAndRemoveTaskOverlay() {
    let taskOverlay = document.getElementById('task-overlay');
    if (taskOverlay) {
        displayNone('task-overlay');
        taskOverlay.innerHTML = '';  // This removes all child elements and content inside taskOverlay
    }
}



function loadJSONDataTasks() {
    const localTasks = localStorage.getItem('tasks');

    if (localTasks) {
        try {
            const tasksData = JSON.parse(localTasks);
            if (tasksData && tasksData.toDo && tasksData.inProgress && tasksData.awaitFeedback && tasksData.done) {
                // Use the local data
                tasks.toDo = tasksData.toDo;
                tasks.inProgress = tasksData.inProgress;
                tasks.awaitFeedback = tasksData.awaitFeedback;
                tasks.done = tasksData.done;

                // Render the tasks after loading
                renderLocalTasks();
                return;
            }
        } catch (error) {
            console.error('Error parsing local storage data:', error);
        }
    }

    // If no valid local data, fetch from guest.json
    fetch('guest.json')
        .then(response => response.json())
        .then(data => {
            const guestTasks = data.tasks.Guest;

            // Convert objects to arrays and add index
            tasks.toDo = convertTasksObjectToArray(guestTasks.toDo);
            tasks.inProgress = convertTasksObjectToArray(guestTasks.inProgress);
            tasks.awaitFeedback = convertTasksObjectToArray(guestTasks.awaitFeedback);
            tasks.done = convertTasksObjectToArray(guestTasks.done);

            // Save to localStorage
            localStorage.setItem('tasks', JSON.stringify(tasks));

            // Render the tasks after loading
            renderLocalTasks();
        })
        .catch(error => console.error('Error loading JSON data:', error));
}


function convertTasksObjectToArray(taskObj) {
    if (!taskObj) return [];
    return Object.keys(taskObj).map((taskId, index) => ({
        ...taskObj[taskId],
        id: taskId,
        index: index
    }));
}