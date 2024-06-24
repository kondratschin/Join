const BASE_URL = "https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/";
let accName = 'Justin Koll';
let contacts = [];
let alphabetContainer = [];

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
    document.getElementById('addContactName').value = '';
    document.getElementById('addContactEmail').value = '';
    document.getElementById('addContactPhone').value = '';
}


function addSubmitEvent() {
    document.getElementById('addContactInputForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        let contactName = document.getElementById('addContactName').value;
        let contactEmail = document.getElementById('addContactEmail').value;
        let contactPhone = document.getElementById('addContactPhone').value;

        await createContact(contactName, contactEmail, contactPhone);
    });
}


function addEditSubmitEvent() {
    document.getElementById('editContactInputForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        let contactName = document.getElementById('editContactName').value;
        let contactEmail = document.getElementById('editContactEmail').value;
        let contactPhone = document.getElementById('editContactPhone').value;

        await editContact(contactName, contactEmail, contactPhone);
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
        alert("Contact creation successfully.");
    } else {
        console.log("Error creating contact.");
    };
    getContacts();
}


async function editContact(contactName, contactEmail, contactPhone) {
    let editContact = {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
    };
    let response = await fetch(BASE_URL + "contacts/" + accName + "/" + contactName + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(editContact)
    });
    if (response.ok) {
        alert("Edit Contact successfully.");
    } else {
        console.log("Error Editing contact.");
    };
}


function showAddContact(id) {
    appear(id);
    fadeIn('addContactPopup');
    addSubmitEvent();
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


function editContact(color, initials, name, email, phone) {
    showAddContact('addContactPopupBackground');
    editCart(color, initials, name, email, phone);
}


function editCart(color, initials, name, email, phone) {
    let popup = document.getElementById('addContactPopup');
    showAddContact('addContactPopupBackground');
    popup.innerHTML = `
        <div class="addContactCardLeftSide">
            <div class="addContactCardLeftSideContent">
                <img src="./img/Capa-2.svg">
                <h1>Edit contact</h1>
                <div class="addContactCardLeftSideBreake">

                </div>
            </div>
        </div>
        <div class="addContactCardRightSide">
            <div class="addContactCardRightSideContent">
                <div class="addContactCardRightSideContentImg">
                    <p class="contactsEditContactInitials" style="background: ${color};">
            ${initials}
            </p>
                </div>
                <div class="addContactCardRightSideContentInputfieldsAndButtons">

                    <div class="addContactCardRightSideContentInputfields">
                        <div class="closeButtonDiv">
                            <div class="closeButtonBackground"
                                onclick="vanishAddConact()">
                                <img class="addContactCloseButton" src="./img/close.svg">
                            </div>
                        </div>
                         <form id="editContactInputForm">
                            <div class="input">
                                <input id="editContactName" class="addContactInput" placeholder="Name"
                                    type="text" pattern="([A-Z][a-z]{1,}\s[A-Z][a-z]{1,})+"
                                    title="Please enter at least two words with initial capital letters"
                                    >
                                <img src="./img/person.svg">
                            </div>
                            <div class="input">
                                <input id="editContactEmail" class="addContactInput" placeholder="Email"
                                    type="email" >
                                <img src="./img/mail.svg">
                            </div>
                             <div class="input">
                                <input id="editContactPhone" class="addContactInput" placeholder="Phone"
                                    type="tel" pattern="([0-9])+" title="Only Nummbers allowed" >
                                <img src="./img/call.svg">
                            </div>
                            <div class="addContactButtons">
                                <button type="reset" class="cancelButton"
                                     onclick="vanishAddConact()">Delete
                                </button>
                                 <button type="submit" class="editContactButton">Save <img src="./img/buttonCheck.svg">
                                 </button>
                            </div>
                        </form>

                    </div>

                </div>
            </div>
        </div>
    `;
    document.getElementById('editContactName').value = name;
    document.getElementById('editContactEmail').value = email;
    document.getElementById('editContactPhone').value = phone;
    addEditSubmitEvent();
}