function load(){
    addPlus();
}

function addPlus(){
    document.getElementById('addTaskButton').innerHTML += `
    <img class="add" src="./img/add.svg" alt="Add">`;
}