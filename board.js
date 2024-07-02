const BASE_URL = "https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/";
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
    getTasks();  // Aufrufen der getTasks beim Laden der Seite
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

    renderTasks(); // Diese Funktion müsste implementiert werden, um die Tasks anzuzeigen
}


/**
 * This is just an example, logic needs to be implemented
 * @returns 
 */
function renderOverlayTask(taskCategory = 'toDo') { // Add parameter to choose the task category
    let content = document.getElementById('task-overlay');
    const tasksInCategory = tasks[taskCategory]; // Get tasks from the specified category

    if (tasksInCategory.length === 0) {
        content.innerHTML = "<p>No tasks available in this category.</p>";
        return;
    }

    let task = tasksInCategory[0]; // Display the first task for this example
    let selectedContact = task.selectedContacts.length > 0 ? task.selectedContacts[0] : { color: '#ccc', initials: '', name: 'Unknown' };

    content.innerHTML = /*html*/ `
    <div class="task-overlay-head">
        <span class="task-overlay-category">${task.chosenCategory} !!farbe anpassen!!</span> 
        <img onclick="closeOverlay()" src="./img/close.svg" alt="">
    </div>
    <span class="task-overlay-title">${task.id}</span>
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