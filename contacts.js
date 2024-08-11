const BASE_URL = "https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/";
let accName = getName();
let contacts = [];
let alphabetContainer = [];

/**
 * Clears the inputfield in the add contact cart
 * 
*/
function clearInput() {
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
}

/**
 * Attaches a submit event listener to the contact input form.
 * The event listener collects the contact details (name, email, phone) from the form fields. It then calls the `createContact` function with the collected data.
 */
function addSubmitEvent() {
    document.getElementById('addContactInputForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        let contactName = document.getElementById('contactName').value;
        let contactEmail = document.getElementById('contactEmail').value;
        let contactPhone = document.getElementById('contactPhone').value;

        await createContact(contactName, contactEmail, contactPhone);
    });
}

/**
 * Adds an event listener to a form for submitting edited contact details. When the form is submitted, it asynchronously calls the `editContact` function to update the contact details.
 *
 * @async
 * @param {string} color - The color associated with the contact.
 * @param {string} oldName - The old name of the contact before editing.
 */
async function addEditSubmitEvent(color, oldName) {
    document.getElementById('editContactInputForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        let contactName = document.getElementById('contactName').value;
        let contactEmail = document.getElementById('contactEmail').value;
        let contactPhone = document.getElementById('contactPhone').value;
        await editContact(contactName, contactEmail, contactPhone, color, oldName);
    });
}

/**
 * Asynchronously creates a new contact either locally or on a remote server, depending on account availability. If the user's account name is not available, the contact will be created locally. Otherwise, 
 * the contact will be sent to a remote server and stored under the user's account.
 * @async
 * @function createContact
 * 
 * @param {string} contactName - The name of the contact to be created.
 * @param {string} contactEmail - The email address of the contact to be created.
 * @param {string} contactPhone - The phone number of the contact to be created.
 * 
 * @throws {Error} If there is an issue with the network request while creating the contact on the remote server.
 */
async function createContact(contactName, contactEmail, contactPhone) {
    let accName = getName();
    
    if (!accName) {
        createContactLocally(contactName, contactEmail, contactPhone);
    } else {
        let hue = Math.random() * 360;
        let randomColor = `hsl(${hue}, 70%, 50%)`;
        let newContact = {
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
            color: randomColor
        };

        try {
            let response = await fetch(BASE_URL + "contacts/" + accName + "/" + contactName + ".json", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newContact)
            });

            if (response.ok) {
                showSuccesPopup();
                await getContacts();
                vanishAddConact();
            } else {
                console.log("Error creating contact.");
            }
        } catch (error) {
            console.error('There was an issue creating the contact:', error);
        }
    }
}

/** Edits a contact locally or on the server based on `accName`, handling updates, deletions, UI refresh, and error logging.
 * 
 * @async
 * @function editContact
 * @param {string} contactName - The new name of the contact.
 * @param {string} contactEmail - The new email address of the contact.
 * @param {string} contactPhone - The new phone number of the contact.
 * @param {string} contactColor - The new color associated with the contact.
 * @param {string} oldName - The previous name of the contact, used for identification before editing.
 * 
 */
async function editContact(contactName, contactEmail, contactPhone, contactColor, oldName) {
    let accName = getName();

    if (!accName) {
        editContactLocally(contactName, contactEmail, contactPhone, contactColor, oldName);
    } else {
        let initials = contactName.match(/\b(\w)/g).join('');
        let editData = {
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
            color: contactColor
        };

        try {
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
                console.log("Error editing contact.");
            }

            await deleteBackendContact(oldName);
            await getContacts();
            vanishAddConact();
            showContactDetails(contactColor, initials, contactName, contactEmail, contactPhone);
        } catch (error) {
            console.error('There was an issue editing the contact:', error);
        }
    }
}

/**
 * Displays a success popup by fading it in and then automatically fading it out after a delay.
 */
function showSuccesPopup() {
    fadeIn('contactSuccesBox');
    displayElement('contactSuccesBox');
    setTimeout(fadeSuccesPopup, 2000);
}

/**
 * Fades out the success popup element and hides it after a brief delay.
 */
function fadeSuccesPopup() {
    fadeOut('contactSuccesBox');
    setTimeout(dnoneSuccesPopup, 100);
}

/**
 * Hides the success popup element by setting its display style to 'none'.
 */
function dnoneSuccesPopup() {
    displayNone('contactSuccesBox');
}

/**
 * Displays the "Add Contact" popup and prepares the necessary elements.
 * @param {string} id - The ID of the element that should appear on the screen.
 */
function showAddContact(id) {
    addNewContactCart();
    appear(id);
    fadeIn('addContactPopup');
    addSubmitEvent();
}

/**
 * Displays the edit contact interface for a specified contact.
 * 
 * @param {string} id - The unique identifier of the contact to be edited.
 * @param {string} color - The color associated with the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * 
 * @returns {void}
 */
function showEditContact(id, color, initials, name, email, phone) {
    editCart(color, initials, name, email, phone);
    appear(id);
    fadeIn('addContactPopup');
    addEditSubmitEvent(color, name);
}

/**
 * Hides the add contact popup interface
 *
 */
function vanishAddConact() {
    vanish('addContactPopupBackground');
    clearInput();
    fadeOut('addContactPopup');
}

/**
 * Creates an array of objects where each object represents a letter of the English alphabet. Each object contains a `letter` property with the letter and a `list` property which is an empty array. The result is stored in a global variable named `alphabetContainer`.
 *
 */
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

/** Sorts the contact list alphabetically by organizing contacts into categories based on their starting character.
 * 
 * @param {Object} responseAsJson - The contacts data in JSON format where keys are contact identifiers and values are contact details.
 * @param {string[]} contactsAsArray - An array of contact identifiers to be sorted.
 * 
 */
function sortContactlist(responseAsJson, contactsAsArray) {
    createContactSortArray();
    for (let i = 0; i < contactsAsArray.length; i++) {
        for (let alphabetNr = 0; alphabetNr < alphabetContainer.length; alphabetNr++) {
            const alphabetChar = alphabetContainer[alphabetNr];
            pushContactIntoSort(responseAsJson, contactsAsArray[i], alphabetChar);
        }
    };
}

/**
 * Adds a contact from the `responseAsJson` object to a list in `alphabetChar` if the contact's name starts with the specified `alphabetChar`. This function is used to organize contacts into different lists based on the initial letter of their names.
 * 
 * @param {Object} responseAsJson - The JSON object containing contact data.
 * @param {string[]} contactsAsArray - An array of contact keys to be processed.
 * @param {Object} alphabetChar - An object containing the criteria for sorting.
 * @param {string} alphabetChar.letter - The letter used to filter contacts by the first character of their names.
 * @param {Object[]} alphabetChar.list - The list to which matching contacts will be added. Each contact is represented by an object with `name`, `email`, `phone`, and `color` properties.
 * 
 */
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

/** Clears the contact container and creates contact list sections for each letter in the `alphabetContainer` array.*/
function showContactsInList() {
    let contactCarts = document.getElementById('contactCarts');
    contactCarts.innerHTML = "";

    for (let i = 0; i < alphabetContainer.length; i++) {
        const sortLetterNr = alphabetContainer[i];
        createContactListAlphabethicContainer(sortLetterNr);
    }
}

/** Creates and displays a contact list section for a specific letter if contacts are available, using `printContactAlphabethicContainer` and `showContactInList`.
 * @param {Object} sortLetterNr - An object containing contacts associated with a specific letter.
 * @param {Array} sortLetterNr.list - An array of contacts associated with the letter.
 * 
 * 
 */
function createContactListAlphabethicContainer(sortLetterNr) {
    if (sortLetterNr['list'].length > 0) {
        printContactAlphabethicContainer(sortLetterNr);
        showContactInList(sortLetterNr);
    }
}

/** Displays contacts for a specific letter by iterating through them and calling `printContact` to add each to the list.
 * 
 * @param {Object} sortLetterNr - An object containing contacts associated with a specific letter.
 * @param {Array} sortLetterNr.list - An array of contacts associated with the letter.
 * 
 */
function showContactInList(sortLetterNr) {
    for (let y = 0; y < sortLetterNr['list'].length; y++) {
        const LetterContactNr = sortLetterNr['list'][y];
        printContact(LetterContactNr);
    }
}

/** Deletes a contact locally if `getName()` is falsy; otherwise, deletes it from the server and refreshes the contact list. 
 * 
 * @async
 * @function
 * @param {string} name - The name of the contact to be deleted.
 * @throws {Error} Throws an error if there is an issue with deleting the contact or updating the contact list.
 * 
 */
async function deleteContact(name) {
    if (!getName()) {
        deleteContactLocally(name);
    } else {
        try {
            await deleteBackendContact(name);
            await getContacts();
            clearShowDetails();
        } catch (error) {
            console.error('There was an issue deleting the contact:', error);
        }
    }
}

/** Sends a DELETE request to the backend to remove a contact specified by the `name` parameter using `BASE_URL` and `accName`.
 * 
 * @async
 * @param {string} name - The name of the contact to be deleted. This should match the contact's identifier on the server.
 * @throws {Error} Throws an error if the network request fails or if there is an issue with the response.
 * 
 */
async function deleteBackendContact(name) {
    let response = await fetch(BASE_URL + "/contacts" + "/" + accName + "/" + name + ".json", {
        method: "DELETE",
    });
    return responseAsJason = await response.json();
}

/**
 * Clears the content of the detail box and fades it out.
 * 
 */
function clearShowDetails() {
    let detailBox = document.getElementById('contactsRightsideContentInfoBox');
    detailBox.innerHTML = '';
    fadeOut('contactsRightsideContentInfoBox');
}

/**
 * Displays the contact details view for mobile devices.
 */
function showContactDetailsMobile() {
    document.getElementById('contactsRightsideContent').classList.remove('d-none');
    document.getElementById('contactsContent').classList.add('d-none');
    addEventlistenerMobileMenu();
}

/**
 * Go back to the mobile contact list.
 */
function backToContactList() {
    document.getElementById('contactsRightsideContent').classList.add('d-none');
    document.getElementById('contactsContent').classList.remove('d-none');
}

/**
 * Shows the edit and delete option in mobile version
 */
function showMobileOptions(id) {
    appear(id);
    mobileFadeIn(id);
}

/**
 * Adds an event listener to the document that listens for click events. When a click occurs, it checks whether the clicked element is contained within any elements with the class `excludedObjectMobile`. If the clicked element is not within any of these excluded objects, it triggers the `mobileFadeOut` and `vanish` functions for the element with the ID `dropdownContainerContent`.
 */
function addEventlistenerMobileMenu() {
document.addEventListener('click', function (event) {
    let excludedObjects = document.querySelectorAll('.excludedObjectMobile');
    let clickedElement = event.target;
    let isExcluded = false;

    excludedObjects.forEach(function (object) {
      if (object.contains(clickedElement)) {
        isExcluded = true;
      }
    });
  
    if (!isExcluded) {
        mobileFadeOut('dropdownContainerContent');
        vanish('dropdownContainerContent');
    }
  });
}