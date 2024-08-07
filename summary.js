function load() {
    loadTaskData();
    goodMorningText();
    renderCounts();
}

async function loadTaskData() {
    let name = localStorage.getItem('userName');
    console.log(name); // Check if the name is correctly loaded

    if (name && name !== "null" && name.trim() !== "") {
        try {
            // Path to the user's specific task in the Firebase Realtime Database
            const taskUrl = `https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/tasks/${encodeURIComponent(name)}.json`;

            let response = await fetch(taskUrl);
            if (response.ok) {
                let tasks = await response.json();
                console.log(tasks); // Output task data in the console
                // Save tasks to local storage for offline use
                localStorage.setItem('tasks', JSON.stringify(tasks));
            } else {
                console.error('Failed to fetch tasks:', response.status);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    } else {
        console.log('No username found or username is empty in localStorage, loading tasks from local storage');
        let tasks = localStorage.getItem('tasks');
        if (tasks) {
            tasks = JSON.parse(tasks);
            console.log(tasks); // Output local task data in the console
        } else {
            console.error('No tasks found in local storage');
        }
    }
}

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

async function renderCounts() {
    console.log('Starting renderCounts function');
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

function getUserName() {
    const userName = localStorage.getItem('userName');
    console.log('Retrieved userName from localStorage:', userName);
    return userName;
}

function createDatabaseURL(userName) {
    const url = `https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/tasks/${encodeURIComponent(userName)}`;
    console.log('Database URL:', url);
    return url;
}

async function getUserData(dbUrl) {
    const response = await fetch(`${dbUrl}.json`);
    const data = await response.json();
    console.log('Data fetched for user:', data);
    return data;
}

function processData(data) {
    let counts = initializeCounts();
    for (let category in data) {
        if (data.hasOwnProperty(category)) {
            counts[category] = Object.keys(data[category]).length;
            counts.totalTasks += counts[category];
            console.log(`Counting tasks in category ${category}:`, counts[category]);

            for (let taskKey in data[category]) {
                let task = data[category][taskKey];
                if (task.priority === 'High') {  // Check for high priority
                    counts.urgent++;  // Increase the counter for urgent tasks
                }
                if (task.taskDate && (!counts.nearestDeadline || new Date(task.taskDate) < new Date(counts.nearestDeadline))) {
                    counts.nearestDeadline = formatDate(new Date(task.taskDate));
                    console.log(`New nearest deadline found:`, counts.nearestDeadline);
                }
            }
        }
    }
    return counts;
}

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

function updateNearestDeadline(tasks, counts) {
    for (let taskKey in tasks) {
        let task = tasks[taskKey];
        if (task.taskDate && (!counts.nearestDeadline || new Date(task.taskDate) < new Date(counts.nearestDeadline))) {
            counts.nearestDeadline = formatDate(new Date(task.taskDate));
            console.log(`New nearest deadline found:`, counts.nearestDeadline);
        }
    }
}

function formatDate(date) {
    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).replace(/\./g, '');
}

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
    console.log('Updated HTML elements with counts');
}

function setCountsToZero() {
    console.log('Setting all counts to zero');
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
