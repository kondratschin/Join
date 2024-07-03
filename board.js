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


/**
 * load tasks from firebase into array 'tasks' render overlay for test purpose
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


function renderOverlayTask(index, taskCategory = 'toDo') {
    displayElement('task-overlay');
    let content = document.getElementById('task-overlay');
    const tasksInCategory = tasks[taskCategory]; // Get tasks from the specified category

    if (index >= 0 && index < tasksInCategory.length) {
        let task = tasksInCategory[index]; // Access the specific task by index

        let selectedContact = task.selectedContacts.length > 0 ? task.selectedContacts[0] : { color: '#ccc', initials: '', name: 'Unknown' };

        content.innerHTML = /*html*/ `
        <div class="task-overlay-head">
        <span class="task-overlay-category ${task.chosenCategory === 'Technical Task' ? 'technical-task' : 'user-story-task'}">${task.chosenCategory}</span> 
            <div class="closeButtonBackground">
            <img onclick="displayNone('task-overlay')" src="./img/close.svg" alt="">
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
        <span class="task-overlay-text">Assigned to:</span>
        <div class="task-overlay-assigned">
            <div class="task-overlay-ass-person">
                <div class="initialsContact-small" style="background: ${selectedContact.color}">
                    ${selectedContact.initials}
                </div>
                <span class="pddng-lft-12">${selectedContact.name}</span>
            </div>
        </div>
        <span class="task-overlay-text">Subtasks</span>
        <li> ${task.subTaskList}</li>
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
    console.log(prioritySVGHTML);
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
                <div class="initialsContact-small" style="background: ${contact.color}">
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
            return `<svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_156_1009)"><path d="M19.2597 15.4464C19.0251 15.4468 18.7965 15.3719 18.6077 15.2328L10.3556 9.14965L2.10356 15.2328C1.98771 15.3184 1.85613 15.3803 1.71633 15.4151C1.57652 15.4498 1.43124 15.4567 1.28877 15.4354C1.14631 15.414 1.00944 15.3648 0.885997 15.2906C0.762552 15.2164 0.654943 15.1186 0.569314 15.0029C0.483684 14.8871 0.421712 14.7556 0.386936 14.6159C0.352159 14.4762 0.345259 14.331 0.366629 14.1887C0.409788 13.9012 0.565479 13.6425 0.799451 13.4697L9.70356 6.89926C9.89226 6.75967 10.1208 6.68433 10.3556 6.68433C10.5904 6.68433 10.819 6.75967 11.0077 6.89926L19.9118 13.4697C20.0977 13.6067 20.2356 13.7988 20.3057 14.0186C20.3759 14.2385 20.3747 14.4749 20.3024 14.6941C20.2301 14.9133 20.0904 15.1041 19.9031 15.2391C19.7159 15.3742 19.4907 15.4468 19.2597 15.4464Z" fill="white"/></g></svg>`;
        case 'Medium':
            return `<svg width="21" height="8" viewBox="0 0 21 8" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_185413_2458)"><path d="M19.1526 7.72528H1.34443C1.05378 7.72528 0.775033 7.60898 0.569514 7.40197C0.363995 7.19495 0.248535 6.91419 0.248535 6.62143C0.248535 6.32867 0.363995 6.0479 0.569514 5.84089C0.775033 5.63388 1.05378 5.51758 1.34443 5.51758H19.1526C19.4433 5.51758 19.722 5.63388 19.9276 5.84089C20.1331 6.0479 20.2485 6.32867 20.2485 6.62143C20.2485 6.91419 20.1331 7.19495 19.9276 7.40197C19.722 7.60898 19.4433 7.72528 19.1526 7.72528Z" fill="white"/></g></svg>`;
        case 'Low':
            return `<svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M10.3555 9.69779C10.1209 9.69819 9.89234 9.62335 9.70349 9.48427L0.800382 2.91453C0.566436 2.74174 0.410763 2.48315 0.367609 2.19567C0.324455 1.90819 0.397354 1.61535 0.57027 1.38158C0.743187 1.1478 1.00196 0.992245 1.28965 0.949123C1.57734 0.906001 1.8704 0.978846 2.10434 1.15163L10.3555 7.23412L18.6066 1.15163C18.8405 0.978846 19.1336 0.906001 19.4213 0.949123C19.709 0.992245 19.9678 1.1478 20.1407 1.38158C20.3136 1.61535 20.3865 1.90819 20.3433 2.19567C20.3002 2.48315 20.1445 2.74174 19.9106 2.91453L11.0075 9.48427C10.8186 9.62335 10.5901 9.69819 10.3555 9.69779Z"/></svg>`;
        default:
            return ''; // Kein Bild oder ein Standardbild, falls keine Priorität gesetzt ist
    }
}


function addPlus() {
    document.getElementById('addTaskButton').innerHTML += `
    <img class="add" src="./img/add.svg" alt="Add">`;
}