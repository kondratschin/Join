const BASE_URL = "https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/";
let accName = getName();
let contacts = [];
let alphabetContainer = [];

/**
 * function exists in board.js and must be removed
 * @returns 
 */
function getName() {
    let name = localStorage.getItem('userName');
    return name; // Return the retrieved name
}


/**
 * Hide an element by using ID
 * 
 * 
 * @param {string} id -  This is the ID of an element
*/
function displayNone(id) {
    document.getElementById(id).classList.add('d-none');
}


/**
 * Show an element by using ID
 * 
 * 
 * @param {string} id -  This is the ID of an element
*/
function displayElement(id) {
    document.getElementById(id).classList.remove('d-none');
}


/**
 * Stop the propagation of the displayNone event
 * 
 * 
 * @param {Event} event - The click event
*/
function stopPropagation(event) {
    event.stopPropagation();
}



function appear(id) {
    document.getElementById(id).classList.remove('vanish');
    document.getElementById(id).classList.add('appear');
}


function vanish(id) {
    document.getElementById(id).classList.remove('appear');
    document.getElementById(id).classList.add('vanish');
}


function fadeIn(id) {
    document.getElementById(id).classList.remove('fadeOut');
    document.getElementById(id).classList.add('fadeIn');
}


function fadeOut(id) {
    document.getElementById(id).classList.remove('fadeIn');
    document.getElementById(id).classList.add('fadeOut');
}


/**
 * Clears the inputfield in the add contact cart
 * 
 * 
*/
function clearInput() {
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
}


function addSubmitEvent() {
    document.getElementById('addContactInputForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        let contactName = document.getElementById('contactName').value;
        let contactEmail = document.getElementById('contactEmail').value;
        let contactPhone = document.getElementById('contactPhone').value;

        await createContact(contactName, contactEmail, contactPhone);
    });
}


async function addEditSubmitEvent(color, oldName) {
    document.getElementById('editContactInputForm').addEventListener('submit', async function (event) {
        event.preventDefault();
      
        let contactName = document.getElementById('contactName').value;
        let contactEmail = document.getElementById('contactEmail').value;
        let contactPhone = document.getElementById('contactPhone').value;

        await editContact(contactName, contactEmail, contactPhone, color, oldName);
    });
}


async function createContact(contactName, contactEmail, contactPhone) {
    let hue = Math.random() * 360;
    let randomColor = `hsl(${hue}, 70%, 50%)`
    let newContact = {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        color: randomColor
    };
    let response = await fetch(BASE_URL + "contacts/" + accName + "/" + contactName + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newContact)
    });
    if (response.ok) {
    
    } else {
        console.log("Error creating contact.");
    };
    showSuccesPopup()
    getContacts();
    vanishAddConact();
}


async function editContact(contactName, contactEmail, contactPhone, contactColor, oldName) {
    let initials = contactName.match(/\b(\w)/g).join('');
    let editData = {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        color: contactColor
    };
    let response = await fetch(BASE_URL + "contacts/" + accName + "/" + contactName + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(editData)
    });
    if (response.ok) {
        alert("Edit Contact successfully.");
    } else {
        console.log("Error Editing contact.");
    };
    await deleteBackendContact(oldName);
    getContacts();
    vanishAddConact();
    showContactDetails(contactColor, initials, contactName, contactEmail, contactPhone);
}


function showSuccesPopup() {
    fadeIn('contactSuccesBox');
    displayElement('contactSuccesBox');
    setTimeout(fadeSuccesPopup, 2000);
}


function fadeSuccesPopup() {
    fadeOut('contactSuccesBox');
    setTimeout(dnoneSuccesPopup, 100);
}


function dnoneSuccesPopup() {
    displayNone('contactSuccesBox');
}


function showAddContact(id) {
    addNewContactCart();
    appear(id);
    fadeIn('addContactPopup');
    addSubmitEvent();
}


function showEditContact(id, color, initials, name, email, phone) {
    editCart(color, initials, name, email, phone);
    appear(id);
    fadeIn('addContactPopup');
    addEditSubmitEvent(color, name);
}


function vanishAddConact() {
    vanish('addContactPopupBackground');
    clearInput();
    fadeOut('addContactPopup');
}



function createContactSortArray() {
    alphabetContainer = [];
    const startCharCode = 'A'.charCodeAt(0);
    const endCharCode = 'Z'.charCodeAt(0);

    for (let i = startCharCode; i <= endCharCode; i++) {
        alphabetContainer.push(
            {
                letter: String.fromCharCode(i),
                list: []
            }
        );
    }
}


async function getContacts() {
    let response = await fetch(BASE_URL + "contacts/" + accName + ".json");
    let responseAsJson = await response.json();
    let contactsAsArray = Object.keys(responseAsJson);
    sortContactlist(responseAsJson, contactsAsArray);
    showContactsInList();
}


function sortContactlist(responseAsJson, contactsAsArray) {
    createContactSortArray();
    for (let i = 0; i < contactsAsArray.length; i++) {
        for (let alphabetNr = 0; alphabetNr < alphabetContainer.length; alphabetNr++) {
            const alphabetChar = alphabetContainer[alphabetNr];
            pushContactIntoSort(responseAsJson, contactsAsArray[i], alphabetChar);
        }
    };
}


function pushContactIntoSort(responseAsJson, contactsAsArray, alphabetChar) {
    if (responseAsJson[contactsAsArray]['name'].charAt(0) == alphabetChar['letter']) {
        alphabetChar['list'].push(
            {
                name: responseAsJson[contactsAsArray]['name'],
                email: responseAsJson[contactsAsArray]['email'],
                phone: responseAsJson[contactsAsArray]['phone'],
                color: responseAsJson[contactsAsArray]['color'],
            }
        )
    }
}


function showContactsInList() {
    let contactCarts = document.getElementById('contactCarts');
    contactCarts.innerHTML = "";

    for (let i = 0; i < alphabetContainer.length; i++) {
        const sortLetterNr = alphabetContainer[i];
        createContactListAlphabethicContainer(sortLetterNr);
    }
}


function createContactListAlphabethicContainer(sortLetterNr) {
    if (sortLetterNr['list'].length > 0) {
        printContactAlphabethicContainer(sortLetterNr);
        showContactInList(sortLetterNr);
    }
}


function showContactInList(sortLetterNr) {
    for (let y = 0; y < sortLetterNr['list'].length; y++) {
        const LetterContactNr = sortLetterNr['list'][y];
        printContact(LetterContactNr);
    }
}


async function deleteContact(name) {
    await deleteBackendContact(name);
    await getContacts();
    clearShowDetails();
}


async function deleteBackendContact(name) {
    let response = await fetch(BASE_URL + "/contacts" + "/" + accName + "/" + name + ".json", {
        method: "DELETE",
    });
    return responseAsJason = await response.json();
}


function clearShowDetails() {
    let detailBox = document.getElementById('contactsRightsideContentInfoBox');
    detailBox.innerHTML = '';
    fadeOut('contactsRightsideContentInfoBox');
}



let widthMatch = window.matchMedia("(max-width: 770px)");
    // mm in the function arg is the matchMedia object, passed back into the function
widthMatch.addEventListener('change', function(mm) {
if (mm.matches) {
    document.querySelectorAll(".contactCart")
}
else {
    // it no longer matches the media query
    // remove the event listener
}
});