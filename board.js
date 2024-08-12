let tasks = {
    toDo: [],
    inProgress: [],
    awaitFeedback: [],
    done: []
};
let currentDraggedElement;

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
        let validContacts = selectedContacts.filter(contact => contact !== undefined && contact !== null);
        content.innerHTML = generateOverlayHTML(task, validContacts, hasSubtasks, chosenCategory, taskCategory, index);
    } else {
        content.innerHTML = "<p>No tasks available in this category or invalid index.</p>";
    }
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
        }
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
        }
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
    let userName = getName();
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
  document.getElementById(`taskBoard${currentCategory}${index}`).classList.add("rotate");
}

/**
 * Removes the CSS class that rotates the task by a small degree.
 */
function removeRotation() {
    const elements = document.querySelectorAll('.rotate');
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
 * Moves the task to the specified category list, updating either local storage or Firebase.
 * @param {string} category - The target category to move the task to.
 * @returns {Promise<void>}
 */
async function moveTo(category) {
    let [index, currentCategory, taskTitle] = currentDraggedElement;
    moveToCategory(category, index, currentCategory, taskTitle);
    renderToDoList();
    checkArraysForContent();

    if (getName() === null || getName().trim() === '') {
        // If getName() returns null or empty, handle the move locally
        moveToLocally(category, index, currentCategory, taskTitle);
    } else {
        // Otherwise, proceed with the Firebase update
        try {
            await updateFirebase(category, index, currentCategory, taskTitle);
        } catch (error) {
            console.error("Error moving task:", error);
        }
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
    let [task] = tasks[currentCategory].splice(taskIndex, 1);
    task.category = category;
    tasks[category].splice(index, 0, task);
}

/**
 * Updates Firebase with the task's new category and removes it from the old category.
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