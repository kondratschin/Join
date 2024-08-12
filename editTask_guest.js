/**
 * Creates a task in the corresponding list and local storage
 * @param {string} oldTaskTitle - The old title of the task
 * @param {string} newTaskTitle - The new title of the task
 * @param {string} boardStatus - The status of the board (e.g., 'toDo', 'inProgress', 'done')
 */
function saveChangesTaskToLocalStorage(oldTaskTitle, newTaskTitle, boardStatus) {
    let dataToSend = gatherTaskData(newTaskTitle);
    let tasks = getTasksFromLocalStorage(boardStatus);

    updateLocalStorageTasks(tasks, oldTaskTitle, newTaskTitle, boardStatus, dataToSend);

    updateUIAfterSave();
}

/**
 * Gathers the task data from the form fields
 * @param {string} newTaskTitle - The new title of the task
 * @returns {object} - The task data object to be saved
 */
function gatherTaskData(newTaskTitle) {
    return {
        id: newTaskTitle,
        selectedContacts: selectedContacts,
        subTaskList: subTaskList,
        priority: priority,
        chosenCategory: chosenCategory,
        taskDescription: document.getElementById('taskDescription').value,
        taskDate: document.getElementById('taskDate').value
    };
}

/**
 * Retrieves tasks from local storage for a specific board status
 * @param {string} boardStatus - The status of the board (e.g., 'toDo', 'inProgress', 'done')
 * @returns {object} - The tasks object from local storage
 */
function getTasksFromLocalStorage(boardStatus) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    tasks[boardStatus] = tasks[boardStatus] || [];
    return tasks;
}

/**
 * Updates the tasks in local storage based on the old and new task titles
 * @param {object} tasks - The tasks object retrieved from local storage
 * @param {string} oldTaskTitle - The old title of the task
 * @param {string} newTaskTitle - The new title of the task
 * @param {string} boardStatus - The status of the board
 * @param {object} dataToSend - The data of the task to be saved
 */
function updateLocalStorageTasks(tasks, oldTaskTitle, newTaskTitle, boardStatus, dataToSend) {
    let oldTaskIndex = tasks[boardStatus].findIndex(task => task.id === oldTaskTitle);

    if (oldTaskIndex !== -1) {
        if (oldTaskTitle !== newTaskTitle) {
            tasks[boardStatus][oldTaskIndex] = dataToSend;
        } else {
            tasks[boardStatus].splice(oldTaskIndex, 1);
            tasks[boardStatus].push(dataToSend);
        }
    } else {
        tasks[boardStatus].push(dataToSend);
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Updates the UI based on the current page after saving the task
 */
function updateUIAfterSave() {
    if (window.location.pathname.endsWith("addTask.html")) {
        displayElement('task-scc-add-ntn');
        setTimeout(openBoardPage, 900);
    } else if (window.location.pathname.endsWith("board.html")) {
        load();
        displayNone('addTaskWindow');
    }
}

/**
 * Creates a task in the corresponding list and firebase
 * @param {string} oldTaskTitle - The old title of the task
 * @param {string} newTaskTitle - The new title of the task
 * @param {string} boardStatus - The status of the board (e.g., 'toDo', 'inProgress', 'done')
 */
async function saveChangesTask(oldTaskTitle, newTaskTitle, boardStatus) {
    if (!accName) {
        saveChangesTaskToLocalStorage(oldTaskTitle, newTaskTitle, boardStatus);
    } else {
        let dataToSend = gatherTaskData(newTaskTitle);
        let baseUrl = BASE_URL + "tasks/" + accName + "/" + boardStatus + "/";

        if (oldTaskTitle !== newTaskTitle) {
            await updateFirebaseTask(baseUrl, oldTaskTitle, newTaskTitle, dataToSend);
        } else {
            await createOrUpdateFirebaseTask(baseUrl, newTaskTitle, dataToSend);
        }

        updateUIAfterSave();
    }
}

/**
 * Updates the task in Firebase and deletes the old task if the title has changed
 * @param {string} baseUrl - The base URL for the Firebase API
 * @param {string} oldTaskTitle - The old title of the task
 * @param {string} newTaskTitle - The new title of the task
 * @param {object} dataToSend - The task data to be sent to Firebase
 */
async function updateFirebaseTask(baseUrl, oldTaskTitle, newTaskTitle, dataToSend) {
    try {
        let newTaskUrl = baseUrl + newTaskTitle + ".json";
        let oldTaskUrl = baseUrl + oldTaskTitle + ".json";

        let response = await fetch(newTaskUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
            await fetch(oldTaskUrl, {
                method: "DELETE"
            });
        } else {
            console.log("Error updating task.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

/**
 * Creates or updates a task in Firebase
 * @param {string} baseUrl - The base URL for the Firebase API
 * @param {string} newTaskTitle - The title of the task
 * @param {object} dataToSend - The task data to be sent to Firebase
 */
async function createOrUpdateFirebaseTask(baseUrl, newTaskTitle, dataToSend) {
    try {
        let newTaskUrl = baseUrl + newTaskTitle + ".json";

        let response = await fetch(newTaskUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            console.log("Error creating task.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
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

    moveToCategory(newCategory, index, currentCategory, taskTitle);
    renderToDoList();
    checkArraysForContent();

    if (getName() === null || getName().trim() === '') {
        // If getName() returns null or empty, handle the move locally
        moveToLocally(newCategory, index, currentCategory, taskTitle);
    } else {
        // Otherwise, proceed with the Firebase update
        try {
            await updateFirebase(newCategory, index, currentCategory, taskTitle);
        } catch (error) {
            console.error("Error moving task:", error);
        }
    }
}

/**
 * Moves the task to the category list above the current one, updating either local storage or Firebase.
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

    moveToCategory(newCategory, index, currentCategory, taskTitle);
    renderToDoList();
    checkArraysForContent();

    if (getName() === null || getName().trim() === '') {
        // If getName() returns null or empty, handle the move locally
        moveToLocally(newCategory, index, currentCategory, taskTitle);
    } else {
        // Otherwise, proceed with the Firebase update
        try {
            await updateFirebase(newCategory, index, currentCategory, taskTitle);
        } catch (error) {
            console.error("Error moving task:", error);
        }
    }
}