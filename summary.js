let tasks = {
    toDo: [],
    inProgress: [],
    awaitFeedback: [],
    done: []
};

/**
 * Initial load of data to show summary. Load guest.json if guest is logged in
 */
function load() {
    if (!getName()) {
        loadJSONDataTasks();
        goodMorningText();
        setTimeout(renderCounts, 100);
    } else {
    loadTaskData();
    goodMorningText();
    renderCounts();
}
}


/**
 * Load tasks from logged in user, fallback to guest.json if no user name
 */
async function loadTaskData() {
    let name = localStorage.getItem('userName');

    if (name && name !== "null" && name.trim() !== "") {
        try {
            // Path to the user's specific task in the Firebase Realtime Database
            const taskUrl = `https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/tasks/${encodeURIComponent(name)}.json`;

            let response = await fetch(taskUrl);
            if (response.ok) {
                let tasks = await response.json();
                // Save tasks to local storage for offline use
                localStorage.setItem('tasks', JSON.stringify(tasks));
            } else {
                console.error('Failed to fetch tasks:', response.status);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    } else {
        let tasks = localStorage.getItem('tasks');
        if (tasks) {
            tasks = JSON.parse(tasks);
        } else {
            console.error('No tasks found in local storage');
        }
    }
}


/**
 * Show good morning text and user name if available
 */
function goodMorningText() {
    let name = localStorage.getItem('userName');

    // Check if 'name' is not null and is not an empty string
    if (name && name !== "null" && name.trim() !== "") {
        // If there is a name, update the 'name' element
        document.getElementById('name').innerHTML = `${name}`;
    } else {
        // If there is no name, just say "Good morning"
        document.getElementById('goodMorningText').innerHTML = "Good morning";
    }
}


/**
 * Render the amount of tasks
 * @returns 
 */
async function renderCounts() {
    const userName = getUserName();

    if (!userName || userName === "null" || userName.trim() === "") {
        // Load tasks from local storage if no userName
        let tasks = localStorage.getItem('tasks');
        if (tasks) {
            tasks = JSON.parse(tasks);
            const counts = processData(tasks);
            updateUI(counts);
        } else {
            setCountsToZero();
        }
        return;
    }

    const dbUrl = createDatabaseURL(userName);
    try {
        const data = await getUserData(dbUrl);
        if (!data) {
            setCountsToZero();
            return;
        }

        const counts = processData(data);
        updateUI(counts);
    } catch (error) {
        console.error('Error fetching data from Firebase:', error);
        setCountsToZero();
    }
}


/**
 * 
 * @returns User name 
 */
function getUserName() {
    const userName = localStorage.getItem('userName');
    return userName;
}


/**
 * Fetches the tasks from user.
 * @param {string} userName 
 * @returns 
 */
function createDatabaseURL(userName) {
    const url = `https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/tasks/${encodeURIComponent(userName)}`;
    return url;
}


async function getUserData(dbUrl) {
    const response = await fetch(`${dbUrl}.json`);
    const data = await response.json();
    return data;
}


/**
 * Checks the priorities of each tasks and counts them
 * @param {string} data 
 * @returns 
 */
function processData(data) {
    let counts = initializeCounts();
    for (let category in data) {
        if (data.hasOwnProperty(category)) {
            counts[category] = Object.keys(data[category]).length;
            counts.totalTasks += counts[category];

            for (let taskKey in data[category]) {
                let task = data[category][taskKey];
                if (task.priority === 'High') {  // Check for high priority
                    counts.urgent++;  // Increase the counter for urgent tasks
                }
                if (task.taskDate && (!counts.nearestDeadline || new Date(task.taskDate) < new Date(counts.nearestDeadline))) {
                    counts.nearestDeadline = formatDate(new Date(task.taskDate));
                }
            }
        }
    }
    return counts;
}


/**
 * Initial counts
 * @returns 
 */
function initializeCounts() {
    return {
        toDo: 0,
        done: 0,
        inProgress: 0,
        awaitingFeedback: 0,
        urgent: 0,
        totalTasks: 0,
        nearestDeadline: null
    };
}


/**
 * Shows the earliest dead line for tasks
 * @param {*} tasks 
 * @param {*} counts 
 */
function updateNearestDeadline(tasks, counts) {
    for (let taskKey in tasks) {
        let task = tasks[taskKey];
        if (task.taskDate && (!counts.nearestDeadline || new Date(task.taskDate) < new Date(counts.nearestDeadline))) {
            counts.nearestDeadline = formatDate(new Date(task.taskDate));
        }
    }
}


/**
 * Format date
 * @param {number} date 
 * @returns 
 */
function formatDate(date) {
    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).replace(/\./g, '');
}


/**
 * Updates UI with total counts
 * @param {number} counts 
 */
function updateUI(counts) {
    const updateElement = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = value;
        } else {
            console.error(`Element not found: ${id}`);
        }
    };

    updateElement('toDo', counts.toDo);
    updateElement('done', counts.done);
    updateElement('taskInProgress', counts.inProgress);
    updateElement('awaitingFeedback', counts.awaitingFeedback);
    updateElement('urgent', counts.urgent);
    updateElement('taskInBoard', counts.totalTasks);
    updateElement('dedlineDate', counts.nearestDeadline || 'No deadlines set');
}


/**
 * Sets all counts to zero
 */
function setCountsToZero() {
    updateUI({
        toDo: 0,
        done: 0,
        inProgress: 0,
        awaitingFeedback: 0,
        urgent: 0,
        totalTasks: 0,
        nearestDeadline: 'No deadlines set'
    });
}


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

        })
        .catch(error => console.error('Error loading JSON data:', error));
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