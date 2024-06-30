const BASE_URL = "https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/";
let accName = 'Justin Koll';
let tasks = [];


/**
 * load tasks from firebase into array 'tasks' render overlay for test purpose
 */
async function getTasks() {
    try {
        let response = await fetch(BASE_URL + "tasks/" + accName + ".json");
        let responseAsJson = await response.json();

        if (responseAsJson) {
            Object.keys(responseAsJson).forEach(taskKey => {
                let task = responseAsJson[taskKey];
                task.taskTitle = taskKey;
                tasks.push(task);
            });
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }

    renderOverlayTask();
}


/**
 * This is just an example, logic needs to be implemented
 * @returns 
 */
function renderOverlayTask() {
    let content = document.getElementById('task-overlay');

    if (tasks.length === 0) {
        content.innerHTML = "<p>No tasks available.</p>";
        return;
    }

    let task = tasks[0]; // Display the first task for this example
    let selectedContact = task.selectedContacts.length > 0 ? task.selectedContacts[0] : { color: '#ccc', initials: '', name: 'Unknown' };

    content.innerHTML = /*html*/ `
    <div class="task-overlay-head">
        <span class="task-overlay-category">${task.chosenCategory} !!farbe anpassen!!</span> 
        <img src="./img/close.svg" alt="">
    </div>
    <span class="task-overlay-title">${task.taskTitle}</span>
    <span class="task-overlay-text">${task.taskDescription}</span>
    <span class="task-overlay-text">Due date: ${task.taskDate}</span>
    <span class="task-overlay-text">Priority: ${task.priority}</span>
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
    <span> ${task.subTaskList}</span>
    <div class="task-overlay-foot">
        <img id="recycle-small-img" class="plus" src="./img/recycle.svg" alt="">
        <span>Delete</span>
        <img src="./img/separator-small.svg" class="sep-small" alt="">
        <img id="edit-small-img" class="plus" src="./img/edit-small.svg" alt="">
        <span>Edit</span>
    </div>
    `;
}


function load(){
    addPlus();
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