/**
 * Edits an existing contact in the local storage.
 * 
 * This function modifies an existing contact's details in the local storage by first
 * deleting the old contact entry identified by `oldName` and then adding the updated contact
 * with the new details provided. After updating the contacts list, it saves the changes
 * back to the local storage, shows a success popup, retrieves the updated contacts list,
 * and then hides the contact addition form.
 * 
 * @param {string} contactName - The new name of the contact.
 * @param {string} contactEmail - The new email address of the contact.
 * @param {string} contactPhone - The new phone number of the contact.
 * @param {string} contactColor - The new color associated with the contact.
 * @param {string} oldName - The old name of the contact that is to be edited.
 */
function editContactLocally(contactName, contactEmail, contactPhone, contactColor, oldName) {
    let contacts = JSON.parse(localStorage.getItem('contacts')) || {};
    delete contacts[oldName];
    contacts[contactName] = {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        color: contactColor
    };
    localStorage.setItem('contacts', JSON.stringify(contacts));
    showSuccesPopup();
    getContactsLocally();
    vanishAddConact();
}

/**
 * Loads JSON data from a local `guest.json` file, processes it, and stores the relevant contact information in `localStorage`.
 * This function fetches the JSON data, extracts the contacts for the "Guest" category, and saves this data in `localStorage` under the key `'contacts'`.
 * After storing the data, it calls `getContactsLocally` to handle the locally stored contacts.
 * 
 * @throws {Error} Throws an error if the fetch operation fails or if there is an issue processing the JSON data.
 *  
 */
function loadJSONDataContacts() {
    fetch('guest.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('contacts', JSON.stringify(data.contacts.Guest));
            getContactsLocally();
        })
        .catch(error => console.error('Error loading JSON data:', error));
}

/**
 * Check if guest is logged in and check local storage for contacts, if not available load guest.json data
 */
document.addEventListener("DOMContentLoaded", function() {
    if (!getName()) {
        if (!localStorage.getItem('contacts')) {
            loadJSONDataContacts();
        } else {
            getContactsLocally();
        }
    }
});

/**
 * Creates a new contact and saves it locally in the browser's localStorage.
 * This function generates a random color for the contact and stores the contact details 
 * (name, email, and phone) in localStorage under the key 'contacts'. It then shows a success 
 * popup, retrieves the updated list of contacts, and hides the contact creation form.
 * 
 * @param {string} contactName - The name of the contact to be created. This will be used as the key in localStorage.
 * @param {string} contactEmail - The email address of the contact.
 * @param {string} contactPhone - The phone number of the contact.
 * 
 * @throws {Error} Throws an error if there is a problem with localStorage operations.
 * 
 * 
 */
function createContactLocally(contactName, contactEmail, contactPhone) {
    let contacts = JSON.parse(localStorage.getItem('contacts')) || {};
    let hue = Math.random() * 360;
    let randomColor = `hsl(${hue}, 70%, 50%)`
    let newContact = {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        color: randomColor
    };
    contacts[contactName] = newContact;
    localStorage.setItem('contacts', JSON.stringify(contacts));
    showSuccesPopup();
    getContactsLocally();
    vanishAddConact();
}

/**
 * Deletes a contact from the local storage based on the provided name.
 * This function retrieves the current contacts from local storage, deletes the contact with the specified name,
 * and then updates the local storage with the modified contacts list. After updating the local storage, it 
 * refreshes the list of contacts and clears the contact details display.
 *
 * @param {string} name - The name of the contact to be deleted.
 * 
 */
function deleteContactLocally(name) {
    let contacts = JSON.parse(localStorage.getItem('contacts')) || {};
    delete contacts[name];
    localStorage.setItem('contacts', JSON.stringify(contacts));
    getContactsLocally();
    clearShowDetails();
}

/**
 * Fetches contacts either locally or from a remote server based on the Account that´s logged in variable.
 * 
 */
async function getContacts() {
    if (!accName) {
        getContactsLocally();
    } else {
        try {
            let response = await fetch(BASE_URL + "contacts/" + accName + ".json");
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let responseAsJson = await response.json();
            let contactsAsArray = Object.keys(responseAsJson);
            sortContactlist(responseAsJson, contactsAsArray);
            showContactsInList();
            checkWidthAndAddClickListener();
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
}

/** Retrieves, processes, sorts contacts from local storage, and updates the UI if on 'contacts.html'. */

function getContactsLocally() {
    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    let contactsAsArray = Object.keys(contacts);
    sortContactlist(contacts, contactsAsArray);
    if (window.location.pathname.endsWith('contacts.html')) {
        showContactsInList();
        checkWidthAndAddClickListener();
    }
}