// const BASE_URL = "https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/";
let tasks = {
    toDo: [],
    inProgress: [],
    awaitFeedback: [],
    done: []
};


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


function renderOverlayTask(index, taskCategory = 'toDo') {
    displayElement('task-overlay');
    let content = document.getElementById('task-overlay');
    const tasksInCategory = tasks[taskCategory]; // Get tasks from the specified category

    if (index >= 0 && index < tasksInCategory.length) {
        let task = tasksInCategory[index]; // Access the specific task by index

        let selectedContacts = task.selectedContacts || [];
        let hasSubtasks = task.subTaskList && task.subTaskList.length > 0;

        // Generate HTML for all selected contacts
        let contactsHtml = selectedContacts.map(contact => `
            <div id="assOverlayAssPerson" class="task-overlay-ass-person">
                <div class="initialsContact-small" style="background: ${contact.color}">
                    ${contact.initials}
                </div>
                <span class="pddng-lft-12">${contact.name}</span>
            </div>
        `).join('');

        content.innerHTML = /*html*/ `
            <div class="task-overlay-head">
                <span class="task-overlay-category ${task.chosenCategory === 'Technical Task' ? 'technical-task' : 'user-story-task'}">${task.chosenCategory}</span> 
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
            <div class="${selectedContacts.length > 0 ? '' : 'd-none'}">
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
                <div class="overlay-action highlight-gray">
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



function renderToDoList() {
    let categories = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    categories.forEach(renderList);
}

function checkArraysForContent() {
    const todoPlaceholder = document.getElementById('todoPlaceholder');
    const inProgressPlaceholder = document.getElementById('progressPlaceholder');
    const feedbackPlaceholder = document.getElementById('feedbackPlaceholder');
    const donePlaceholder = document.getElementById('donePlaceholder');
    if (tasks.toDo.length == 0 && todoPlaceholder) {
        todoPlaceholder.classList.remove('d-none');
    }
    if (tasks.inProgress.length == 0 && inProgressPlaceholder) {
        inProgressPlaceholder.classList.remove('d-none');
    }
    if (tasks.awaitFeedback.length == 0 && feedbackPlaceholder) {
        feedbackPlaceholder.classList.remove('d-none');
    }
    if (tasks.done.length == 0 && donePlaceholder) {
        donePlaceholder.classList.remove('d-none');
    }
}

function buildTaskHTML(task, index, taskCategory) {
    let selectedContact = getSelectedContact(task);
    let chosenCategory = task.chosenCategory[0] || 'Default Category';
    let subtasksHTML = getSubtasksHTML(task);
    let contactsHTML = getContactsHTML(task);
    let prioritySVGHTML = getPrioToSVG(task.priority);
    return /*html*/ `
    <div onclick="renderOverlayTask(${index}, '${taskCategory}')" class="taskContainer">
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
    document.getElementById('addTaskButton').innerHTML += `
    <img class="add" src="./img/add.svg" alt="Add">`;
}