/**
 * If guest is logged in load data from guest.json
 * @returns 
 */
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
 * Converts JSON structure to array
 * @param {*} taskObj 
 * @returns 
 */
function convertTasksObjectToArray(taskObj) {
    if (!taskObj) return [];
    return Object.keys(taskObj).map((taskId, index) => ({
        ...taskObj[taskId],
        id: taskId,
        index: index
    }));
}