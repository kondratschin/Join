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
    getTasks().then(renderToDoList);
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


/**
 * This is just an example, logic needs to be implemented
 * @returns 
 */
function renderOverlayTask(taskCategory = 'toDo') { // Add parameter to choose the task category
    displayElement('task-overlay');
    let content = document.getElementById('task-overlay');
    const tasksInCategory = tasks[taskCategory]; // Get tasks from the specified category

    if (tasksInCategory.length === 0) {
        content.innerHTML = "<p>No tasks available in this category.</p>";
        return;
    }

    let task = tasksInCategory[0]; // Display the first task for this example
    let selectedContact = task.selectedContacts.length > 0 ? task.selectedContacts[0] : { color: '#ccc', initials: '', name: 'Unknown' };
        // Access the first element of the chosenCategory array
        let chosenCategory = task.chosenCategory[0];

    content.innerHTML = /*html*/ `
    <div class="task-overlay-head">
    <span class="task-overlay-category ${chosenCategory === 'Technical Task' ? 'technical-task' : 'user-story-task'}">${chosenCategory}</span> 
        <div class="closeButtonBackground">
        <img onclick="displayNone('task-overlay')" src="./img/close.svg" alt="">
        </div>
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
}

function renderToDoList() {
    let categories = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    categories.forEach(renderList);
}


function renderList(taskCategory) {
    let content = document.getElementById(`${taskCategory}List`);
    let tasksInCategory = tasks[taskCategory];

    if (!tasksInCategory || tasksInCategory.length === 0) { 
        content.innerHTML = "<p>No tasks available in this category.</p>";
        return;
    }

    // Start with an empty string to build the HTML content
    let htmlContent = '';

    // Iterate over each task in the category
    for (let i = 0; i < tasksInCategory.length; i++) {
        let task = tasksInCategory[i];
        let selectedContact = task.selectedContacts.length > 0 ? task.selectedContacts[0] : { color: '#ccc', initials: '', name: 'Unknown' };
        let chosenCategory = task.chosenCategory[0];

        // Append the HTML for the current task to the htmlContent variable
        htmlContent += /*html*/ `
        <div class="task-overlay-head">
            <span class="task-overlay-category ${chosenCategory === 'Technical Task' ? 'technical-task' : 'user-story-task'}">${chosenCategory}</span>
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
    }

    // Set the innerHTML of the content element to the complete HTML content
    content.innerHTML = htmlContent;
}




function addPlus(){
    document.getElementById('addTaskButton').innerHTML += `
    <img class="add" src="./img/add.svg" alt="Add">`;
}

function renderTasks(){

}

function generateTask(){

}

async function loadTaskData(){
    
}