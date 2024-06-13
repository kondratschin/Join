/**
 * Moves the logo to the upper corner
 */
function moveLogo() {
  let logo = document.getElementById("splash-screen");
  logo.classList.remove("logo-big");
  logo.classList.add("logo-small");
}


/**
 * Shows the content after the logo is moved
 */
function showContent() {
  document.getElementById('content').classList.remove('d-none');
  setTimeout(() => {
    document.getElementById('content').classList.add('visible');
  }, 10); // Slight delay to ensure transition
}


/**
 * This needs to be moved to an event after loading database
 */
let currentPage = window.location.pathname.split("/").pop();
let currentSearchParams = new URLSearchParams(window.location.search);

if (currentPage === "logIn.html" && !currentSearchParams.has('returnHome')) {
  window.addEventListener('load', function() { 
    setTimeout(function() { 
      moveLogo();  // Führe die Logo-Animation aus
      showContent(); // Zeige den Inhalt direkt danach
    }, 1000); // Warte 1 Sekunde vor Beginn der Animationen
  });
} else {
  showContent(); // Zeige den Inhalt sofort, wenn auf login.html?returnHome oder einer anderen Seite
  moveLogo(); 
}

/**
 * Hide an element by using ID
 * 
 * @param {string} id -  This is the ID of an element
 */
function displayNone(id) {
  document.getElementById(id).classList.add('d-none');
}

/**
 * Show an element by using ID
 * 
 * @param {string} id -  This is the ID of an element
 */
function displayElement(id) {
  document.getElementById(id).classList.remove('d-none');
}

function backToLogInArrow() {o
  window.location.reload();
}

document.write('<a href="' + document.referrer + '">Go Back</a>');

// Allgemeine postData Funktion
const BASE_URL = "https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/";

async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}


//Funktionen für das Posten von Benutzern Aufgaben und Kontakten:


//Benutzer hinzufügen (Log In Daten)
async function addUser(user) {
  return await postData("users", user);
}
// Beispielaufruf:
/*
addUser({
  name: "John Doe",
  email: "john.doe@example.com",
  password: "securepassword"
}).then(response => {
  console.log(response);
});
*/


// Tasks hinzufügen (Board)
async function addTask(task) {
  return await postData(`tasks/${task.status}`, task);
}
// Beispielaufruf:
/*
addTask({
  title: "Task 1",
  description: "Description of task 1",
  assignTo: "John Doe",
  dueDate: "2023-12-31",
  priority: "High",
  category: "Work",
  status: "to do",
  subtasks: ["Subtask 1", "Subtask 2"]
}).then(response => {
  console.log(response);
});
*/


//Contacts hinzufügen
async function addContact(contact) {
  return await postData("contacts", contact);
}
// Beispielaufruf:
/*
addContact({
  name: "Jane Smith",
  email: "jane.smith@example.com",
  phone: "1234567890"
}).then(response => {
  console.log(response);
});
*/

//Benutzer abrufen
async function getUsers() {
  let response = await fetch(BASE_URL + "users.json");
  return await response.json();
}
// Beispielaufruf:
getUsers().then(users => {
  console.log(users);
});


//Tasks abrufen
async function getTasks(status) {
  let response = await fetch(BASE_URL + `tasks/${status}.json`);
  return await response.json();
}
// Beispielaufruf:
getTasks("to do").then(tasks => {
  console.log(tasks);
});


//Contacts abrufen
async function getContacts() {
  let response = await fetch(BASE_URL + "contacts.json");
  return await response.json();
}
// Beispielaufruf:
getContacts().then(contacts => {
  console.log(contacts);
});



// Komplettes Beispiel:
//const BASE_URL = "https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/";

async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

async function addUser(user) {
    return await postData("users", user);
}

async function addTask(task) {
    return await postData(`tasks/${task.status}`, task);
}

async function addContact(contact) {
    return await postData("contacts", contact);
}

async function getUsers() {
    let response = await fetch(BASE_URL + "users.json");
    return await response.json();
}

async function getTasks(status) {
    let response = await fetch(BASE_URL + `tasks/${status}.json`);
    return await response.json();
}

async function getContacts() {
    let response = await fetch(BASE_URL + "contacts.json");
    return await response.json();
}
/*

// Beispielaufrufe:
addUser({
    name: "John Doe",
    email: "john.doe@example.com",
    password: "securepassword"
}).then(response => {
    console.log("User added:", response);
});

addTask({
    title: "Task 1",
    description: "Description of task 1",
    assignTo: "John Doe",
    dueDate: "2023-12-31",
    priority: "High",
    category: "Work",
    status: "to do",
    subtasks: ["Subtask 1", "Subtask 2"]
}).then(response => {
    console.log("Task added:", response);
});

addContact({
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "1234567890"
}).then(response => {
    console.log("Contact added:", response);
});

getUsers().then(users => {
    console.log("Users:", users);
});

getTasks("to do").then(tasks => {
    console.log("Tasks:", tasks);
});

getContacts().then(contacts => {
    console.log("Contacts:", contacts);
});

*/


document.addEventListener('DOMContentLoaded', function () {
  const dropbtn = document.querySelector(".dropbtn");

  dropbtn.addEventListener('click', function (event) {
      event.stopPropagation();
      document.getElementById("myDropdown").classList.toggle("show");
  });


  window.addEventListener('click', function (event) {
    if (!event.target.closest('.dropdown')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
          }
        }
    }
  });
});