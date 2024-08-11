/**
 * Creates a task in the corresponding list and local storage
 * @param {string} oldTaskTitle - The old title of the task
 * @param {string} newTaskTitle - The new title of the task
 * @param {string} boardStatus - The status of the board (e.g., 'toDo', 'inProgress', 'done')
 */
function saveChangesTaskToLocalStorage(oldTaskTitle, newTaskTitle, boardStatus) {
    let taskDescription = document.getElementById('taskDescription').value;
    let taskDate = document.getElementById('taskDate').value;

    let dataToSend = {
        id: newTaskTitle,
        selectedContacts: selectedContacts,
        subTaskList: subTaskList,
        priority: priority,
        chosenCategory: chosenCategory,
        taskDescription: taskDescription,
        taskDate: taskDate
    };

    // Retrieve existing tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    tasks[boardStatus] = tasks[boardStatus] || [];

    // Find the index of the old task if it exists
    let oldTaskIndex = tasks[boardStatus].findIndex(task => task.id === oldTaskTitle);

    // If the task title has changed or it's a new task, update or add the task
    if (oldTaskIndex !== -1) {
        // Update existing task if the title has changed
        if (oldTaskTitle !== newTaskTitle) {
            tasks[boardStatus][oldTaskIndex] = dataToSend;
        } else {
            // Remove the old task if the title has changed
            tasks[boardStatus].splice(oldTaskIndex, 1);
            // Add the new task to the end of the list
            tasks[boardStatus].push(dataToSend);
        }
    } else {
        // Add new task
        tasks[boardStatus].push(dataToSend);
    }

    // Save the updated tasks back to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Check the current page and update the UI accordingly
    if (window.location.pathname.endsWith("addTask.html")) {
        displayElement('task-scc-add-ntn');
        setTimeout(openBoardPage, 900);
    } else if (window.location.pathname.endsWith("board.html")) {
        load();
        displayNone('addTaskWindow');
    }
}

