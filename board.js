let tasks = {
    toDo: [],
    inProgress: [],
    awaitFeedback: [],
    done: []
};

let currentDraggedElement;

/**
 * 
 * @returns the user Name of the logged in user
 */
function getName() {
    let name = localStorage.getItem('userName');
    return name; // Return the retrieved name
}


function load() {
    addPlus();
    getTasks().then(() => {
        renderToDoList();
        checkArraysForContent();
    });
}


/**
 * fetches the tasks from firebase
 */
async function getTasks() {
    const categories = ['toDo', 'inProgress', 'awaitFeedback', 'done'];  // Die Kategorien, die wir abfragen wollen

    try {
        for (const category of categories) {
            const response = await fetch(BASE_URL + "tasks/" + getName() + "/" + category + ".json");
            const responseAsJson = await response.json();
            console.log(category, responseAsJson);  // Zur Überprüfung der geladenen Daten

            if (responseAsJson) {
                tasks[category] = Object.keys(responseAsJson).map(taskKey => ({
                    ...responseAsJson[taskKey],
                    id: taskKey,  // Speichern des Keys als 'id' im Task-Objekt
                    category: category  // Speichern der Kategorie als Teil des Task-Objekts
                }));
            }
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}


/**
 * shows pop up screen wiht details
 * @param {string} index 
 * @param {string} taskCategory 
 * @param {string} chosenCategory 
 */
function renderOverlayTask(index, taskCategory = 'toDo', chosenCategory) {
    displayElement('task-overlay');
    let content = document.getElementById('task-overlay');
    const tasksInCategory = tasks[taskCategory]; // Get tasks from the specified category

    if (index >= 0 && index < tasksInCategory.length) {
        let task = tasksInCategory[index]; // Access the specific task by index

        let selectedContacts = task.selectedContacts || [];
        let hasSubtasks = task.subTaskList && task.subTaskList.length > 0;

        // Filter out undefined contacts
        let validContacts = selectedContacts.filter(contact => contact !== undefined && contact !== null);

        // Generate HTML for all valid selected contacts
        let contactsHtml = validContacts.map(contact => `
            <div id="assOverlayAssPerson" class="task-overlay-ass-person">
                <div class="initialsContact-small" style="background: ${contact.color}">
                    ${contact.initials}
                </div>
                <span class="pddng-lft-12">${contact.name}</span>
            </div>
        `).join('');

        content.innerHTML = /*html*/ `
            <div class="task-overlay-head">
                <span class="task-overlay-category ${chosenCategory === 'Technical Task' ? 'technical-task' : 'user-story-task'}">${task.chosenCategory}</span> 
                <div onclick="displayNone('task-overlay')" class="closeButtonBackground">
                    <img src="./img/close.svg" alt="">
                </div>
            </div>
            <span class="task-overlay-title">${task.id}</span>
            <span class="task-overlay-text">${task.taskDescription}</span>
            <table class="task-overlay-text">
                <tr>
                    <td>Due date:</td>
                    <td>${task.taskDate}</td>
                </tr>
                <tr>
                    <td>Priority:</td>
                    <td>${task.priority}</td>
                </tr>
            </table>
            <div class="${validContacts.length > 0 ? '' : 'd-none'}">
                <span class="task-overlay-text">Assigned to:</span>
                <div class="task-overlay-assigned">
                    ${contactsHtml}
                </div>
            </div>
            <div class="${hasSubtasks ? '' : 'd-none'}">
                <span class="task-overlay-text">Subtasks</span>
                <li> ${task.subTaskList}</li>
            </div>
            <div class="task-overlay-foot">
                <div onclick="deleteTask('${task.id}', '${taskCategory}')" class="overlay-action highlight-gray">
                    <img id="recycle-small-img" class="plus" src="./img/recycle.svg" alt="">
                    <span>Delete</span>
                </div>
                <img src="./img/separator-small.svg" class="sep-small" alt="">
                <div class="overlay-action highlight-gray">
                    <img id="edit-small-img" class="plus" src="./img/edit-small.svg" alt="">
                    <span>Edit</span>
                </div>
            </div>
        `;
    } else {
        content.innerHTML = "<p>No tasks available in this category or invalid index.</p>";
    }
}


/**
 * renders the tasks in the list
 */
function renderToDoList() {
    let categories = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    categories.forEach(renderList);
}


function checkArraysForContent() {
    // Definiere die Kategorien und die zugehörigen Platzhalter
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
            placeholder.classList.remove('d-none'); // Zeige den Platzhalter, wenn keine Tasks sichtbar sind
        } else {
            placeholder.classList.add('d-none'); // Verstecke den Platzhalter, wenn Tasks vorhanden sind
        }
    });
}


function buildTaskHTML(task, index, taskCategory) {
    let selectedContact = getSelectedContact(task);
    let chosenCategory = task.chosenCategory[0] || 'Default Category';
    let subtasksHTML = getSubtasksHTML(task);
    let contactsHTML = getContactsHTML(task);
    let prioritySVGHTML = getPrioToSVG(task.priority);
    
    return /*html*/ `
    <div draggable="true" ondragstart="startDragging('${taskCategory}', ${index}, '${task.id}')" onclick="renderOverlayTask(${index}, '${taskCategory}', '${chosenCategory}')" class="taskContainer" id="taskBoard${index}">
        <div class="task-overlay-head">
            <span class="taskCategory ${chosenCategory === 'Technical Task' ? 'technical-task' : 'user-story-task'}">${chosenCategory}</span>
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


function getSelectedContact(task) {
    return Array.isArray(task.selectedContacts) && task.selectedContacts.length > 0
        ? task.selectedContacts[0]
        : { color: '#ccc', initials: '', name: 'Unknown' };
}


function getSubtasksHTML(task) {
    if (task.subTaskList && task.subTaskList.length > 0) {
        let completedCount = task.subTaskList.filter(subtask => subtask.completed).length;
        let total = task.subTaskList.length;
        let progressPercent = (completedCount / total) * 100;

        return /*html*/ `
        <div class="subTaskContainer">
            <div class="progress">
                <div class="progress-bar" style="width: ${progressPercent}%;"></div>
            </div>
            <span>Subtasks</span>
        </div>`;
    }
    return '';
}


function getContactsHTML(task) {
    let htmlContent = '';
    if (Array.isArray(task.selectedContacts)) {
        task.selectedContacts.forEach(contact => {
            htmlContent += `
                <div class="initialsContact-small margin-left-10" style="background: ${contact.color}">
                    ${contact.initials}
                </div>`;
        });
    } else {
        console.log("Selected contacts is not an array or is undefined", task.selectedContacts);
    }
    return htmlContent;
}


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


function addPlus() {
    const addButton = document.getElementById('addTaskButton');
    // Prüfen, ob das Plus-Symbol bereits existiert
    if (!addButton.querySelector('.add')) {
        addButton.innerHTML += `<img class="add" src="./img/add.svg" alt="Add">`;
    }
}


async function deleteTask(taskId, taskCategory) {
    const userName = getName();
    const url = `${BASE_URL}tasks/${userName}/${taskCategory}/${taskId}.json`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log("Task successfully deleted");
            removeTaskFromUI(taskId, taskCategory);
        } else {
            throw new Error(`Failed to delete task with status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}


function removeTaskFromUI(taskId, taskCategory) {
    tasks[taskCategory] = tasks[taskCategory].filter(task => task.id !== taskId);
    renderList(taskCategory);
    load();
    displayNone('task-overlay')
}


function findTask() {
    let input = document.getElementById('findTaskInput').value.trim().toLowerCase(); // Den Input trimmen und in Kleinbuchstaben umwandeln


    let found = false;
    const taskContainers = document.querySelectorAll('.taskContainer'); // Annahme, dass deine Task-Elemente diese Klasse haben

    taskContainers.forEach(container => {
        const taskDescription = container.querySelector('.taskText').textContent.toLowerCase(); // Text des Task-Beschreibungselements
        const taskTitle = container.querySelector('.taskTitle').textContent.toLowerCase(); // Text des Task-Beschreibungselements
        if (taskDescription.includes(input) || taskTitle.includes(input)) {
            container.classList.remove('d-none');
            found = true;
        } else {
            container.classList.add('d-none');
        }
    });

    if (!found) {
        console.log('Kein Task mit diesem Text gefunden.'); // Hier könntest du auch Benachrichtigungen für den Benutzer anzeigen
    }

    checkArraysForContent();
}


function startDragging(currentCategory, index, taskTitle) {
    currentDraggedElement = [index, currentCategory, taskTitle];
}


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


function allowDrop(ev) {
ev.preventDefault();
}


function moveToCategory(category, index, currentCategory, taskTitle) {
    // Find the task in the current category array
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

    console.log(`Task moved to ${category} at index ${index}`);
}


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

        console.log(`Task moved to ${category} at index ${index}`);
    } catch (error) {
        console.error("Error moving task:", error);
    }
}
