const BASE_URL = "https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/";
let popup = document.getElementById('addContactPopup');
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
        // Prevent default form submission

        // Get form values

        let contactName = document.getElementById('addContactName').value;
        let contactEmail = document.getElementById('addContactEmail').value;
        let contactPhone = document.getElementById('addContactPhone').value;

        // Call the signUp function
        await createContact(contactName, contactEmail, contactPhone);
    });
}


async function createContact(contactName, contactEmail, contactPhone) {
    let newContact = {
        name: contactName,
        email: contactEmail,
        phone: contactPhone
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


function showAddContact(id) {
    displayElement(id);
    addSubmitEvent();
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
        setBackgroundColor();
    }
}


function showContactInList(sortLetterNr) {
    for (let y = 0; y < sortLetterNr['list'].length; y++) {
        const LetterContactNr = sortLetterNr['list'][y];
        printContact(LetterContactNr);
    }
}