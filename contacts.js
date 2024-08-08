const BASE_URL = "https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/";
let accName = getName();
let contacts = [];
let alphabetContainer = [];


window.addEventListener("resize", checkWidthAndAddClickListener);


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


/**
 * Set opacity from element to 1
 * 
 * 
 * @param {string} id - This is the ID of an element
*/
function appear(id) {
    document.getElementById(id).classList.remove('vanish');
    document.getElementById(id).classList.add('appear');
}

/**
 * Set opacity from element to 0
 * 
 * 
 * @param {string} id - This is the ID of an element
*/
function vanish(id) {
    document.getElementById(id).classList.remove('appear');
    document.getElementById(id).classList.add('vanish');
}

/**
 * Slides in element 
 * 
 * 
 * @param {string} id - This is the ID of an element
*/
function fadeIn(id) {
    document.getElementById(id).classList.remove('fadeOut');
    document.getElementById(id).classList.add('fadeIn');
}

/**
 * Slides out element 
 * 
 * 
 * @param {string} id - This is the ID of an element
*/
function fadeOut(id) {
    document.getElementById(id).classList.remove('fadeIn');
    document.getElementById(id).classList.add('fadeOut');
}

/**
 * Slides in element in mobile version
 * 
 * 
 * @param {string} id - This is the ID of an element
*/
function mobileFadeIn(id) {
    document.getElementById(id).classList.remove('mobileOptionFadeOut');
    document.getElementById(id).classList.add('mobileOptionFadeIn');
}

/**
 * Slides out element in mobile version
 * 
 * 
 * @param {string} id - This is the ID of an element
*/
function mobileFadeOut(id) {
    document.getElementById(id).classList.remove('mobileOptionFadeIn');
    document.getElementById(id).classList.add('mobileOptionFadeOut');
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


/**
 * Attaches a submit event listener to the contact input form.
 * 
 * The event listener collects the contact details 
 * (name, email, phone) from the form fields. It then calls the `createContact` function 
 * with the collected data.
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
 * Adds an event listener to a form for submitting edited contact details.
 * When the form is submitted, it asynchronously calls the `editContact` function to update the contact details.
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
 * Asynchronously creates a new contact either locally or on a remote server, depending on account availability.
 * 
 * If the user's account name is not available, the contact will be created locally. Otherwise, 
 * the contact will be sent to a remote server and stored under the user's account.
 * 
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


/**
 * Edits a contact in the contact list, either locally or on a backend server, depending on the user's status.
 * 
 * This function checks if the user has an account (`accName`). If no account is found, the contact is edited locally.
 * If an account is found, the function attempts to edit the contact on a backend server using a `PUT` request.
 * After a successful edit, the old contact data is deleted from the backend, the contact list is refreshed, and the updated
 * contact details are displayed. If an error occurs during the process, it is caught and logged to the console.
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
 * Displays a success popup by fading it in and then automatically fading it out after a delay.
 * 
 * 
 */
function showSuccesPopup() {
    fadeIn('contactSuccesBox');
    displayElement('contactSuccesBox');
    setTimeout(fadeSuccesPopup, 2000);
}


/**
 * Fades out the success popup element and hides it after a brief delay.
 *
 *
 */
function fadeSuccesPopup() {
    fadeOut('contactSuccesBox');
    setTimeout(dnoneSuccesPopup, 100);
}


/**
 * Hides the success popup element by setting its display style to 'none'.
 *
 * 
 */
function dnoneSuccesPopup() {
    displayNone('contactSuccesBox');
}


/**
 * Displays the "Add Contact" popup and prepares the necessary elements.
 *
 *
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
 *
 */
function vanishAddConact() {
    vanish('addContactPopupBackground');
    clearInput();
    fadeOut('addContactPopup');
}


/**
 * Creates an array of objects where each object represents a letter of the English alphabet.
 * Each object contains a `letter` property with the letter and a `list` property which is an empty array.
 * The result is stored in a global variable named `alphabetContainer`.
 *
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


/**
 * Fetches contacts either locally or from a remote server based on the Account that´s logged in variable.
 * 
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
            // checkWidthAndAddClickListener();
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }
}


/**
 * Sorts the contact list based on predefined alphabetic categories.
 * This function iterates over an array of contact identifiers and organizes each contact into a sort structure 
 * based on its starting alphabet character.
 * 
 * @param {Object} responseAsJson - The contacts data in JSON format where keys are contact identifiers and values are contact details.
 * @param {string[]} contactsAsArray - An array of contact identifiers to be sorted.
 * 
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
 * Adds a contact from the `responseAsJson` object to a list in `alphabetChar` if the contact's name starts with the specified `alphabetChar`.
 * 
 * This function is used to organize contacts into different lists based on the initial letter of their names.
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


/**
 * Clears the contact container and creates contact list sections for each letter in the alphabet.
 * 
 * This function retrieves the HTML element with the ID 'contactCarts', clears its content, and then iterates through
 * the `alphabetContainer` array to create and display contact list sections for each letter.
 * 
 * 
 */
function showContactsInList() {
    let contactCarts = document.getElementById('contactCarts');
    contactCarts.innerHTML = "";

    for (let i = 0; i < alphabetContainer.length; i++) {
        const sortLetterNr = alphabetContainer[i];
        createContactListAlphabethicContainer(sortLetterNr);
    }
}


/**
 * Creates and displays a contact list section for a specific letter if there are contacts available.
 * 
 * This function checks if there are contacts associated with the given letter (`sortLetterNr`). If contacts are available,
 * it calls `printContactAlphabethicContainer` to print the section header and `showContactInList` to display the contacts.
 * 
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


/**
 * Displays contacts in a list format for a specific letter.
 * 
 * This function iterates through the contacts associated with the given letter (`sortLetterNr`) and calls `printContact` 
 * for each contact to display them in the list.
 * 
 * @param {Object} sortLetterNr - An object containing contacts associated with a specific letter.
 * @param {Array} sortLetterNr.list - An array of contacts associated with the letter.
 * 
 * 
 */
function showContactInList(sortLetterNr) {
    for (let y = 0; y < sortLetterNr['list'].length; y++) {
        const LetterContactNr = sortLetterNr['list'][y];
        printContact(LetterContactNr);
    }
}


/**
 * Deletes a contact either locally or from the remote server based on the presence of a defined name.
 * If `getName()` returns a falsy value, the contact is deleted locally.
 * If `getName()` returns a truthy value, the contact is deleted from the remote server, and the contact list is refreshed.
 * 
 * @async
 * @function
 * @param {string} name - The name of the contact to be deleted.
 * @throws {Error} Throws an error if there is an issue with deleting the contact or updating the contact list.
 * 
 * 
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


/**
 * Deletes a contact from the local storage based on the provided name.
 * 
 * This function retrieves the current contacts from local storage, deletes the contact with the specified name,
 * and then updates the local storage with the modified contacts list. After updating the local storage, it 
 * refreshes the list of contacts and clears the contact details display.
 *
 * @param {string} name - The name of the contact to be deleted.
 * 
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
 * Deletes a contact from the backend server.
 * 
 * This function sends a `DELETE` request to the backend server to remove a contact specified by the `name` parameter.
 * The URL for the request is constructed using the `BASE_URL` and `accName` variables along with the contact's name.
 * 
 * @async
 * @param {string} name - The name of the contact to be deleted. This should match the contact's identifier on the server.
 * @throws {Error} Throws an error if the network request fails or if there is an issue with the response.
 * 
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
 * 
 */
function clearShowDetails() {
    let detailBox = document.getElementById('contactsRightsideContentInfoBox');
    detailBox.innerHTML = '';
    fadeOut('contactsRightsideContentInfoBox');
}


/**
 * Displays the contact details view for mobile devices.
 * 
 * 
 */
function showContactDetailsMobile() {
    document.getElementById('contactsRightsideContent').classList.remove('d-none');
    document.getElementById('contactsContent').classList.add('d-none');
    addEventlistenerMobileMenu();
}


/**
 * Go back to the mobile contact list.
 * 
 * 
 */
function backToContactList() {
    document.getElementById('contactsRightsideContent').classList.add('d-none');
    document.getElementById('contactsContent').classList.remove('d-none');
}


/**
 * Adjusts the visibility of contact details and adds or removes event listeners based on the window width.
 * 
 * 
 */
if (window.location.pathname === '/contacts.html') {
    function checkWidthAndAddClickListener() {
        let contactCartElements = document.getElementsByClassName('contactCart');

        if (window.innerWidth <= 770) {
            document.getElementById('contactsDetailBackarrow').classList.remove('d-none');
            for (let contactCart of contactCartElements) {
                contactCart.addEventListener("click", showContactDetailsMobile);
            }
        } else {
            document.getElementById('contactsDetailBackarrow').classList.add('d-none');
            document.getElementById('contactsRightsideContent').classList.remove('d-none');
            document.getElementById('contactsContent').classList.remove('d-none');
            for (let contactCart of contactCartElements) {
                contactCart.removeEventListener("click", showContactDetailsMobile);
            }
        }
    }
}

/**
 * Shows the edit and delete option in mobile version
 * 
 * 
 */
function showMobileOptions(id) {
    appear(id);
    mobileFadeIn(id);
}


/**
 * Adds an event listener to the document that listens for click events.
 * When a click occurs, it checks whether the clicked element is contained within any elements with the class `excludedObjectMobile`.
 * If the clicked element is not within any of these excluded objects, it triggers the `mobileFadeOut` and `vanish` functions for the element with the ID `dropdownContainerContent`.
 * 
 * 
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


/**
 * Retrieves contacts from local storage and processes them.
 * 
 * This function attempts to fetch contacts from `localStorage` under the key `'contacts'`.
 * If no contacts are found, it defaults to an empty array. It then sorts the contacts and
 * updates the displayed contact list if the current page is `contacts.html`.
 * 
 * 
 */
function getContactsLocally() {
    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    let contactsAsArray = Object.keys(contacts);
    sortContactlist(contacts, contactsAsArray);
    if (window.location.pathname.endsWith('contacts.html')) {
        showContactsInList();
    }
}


/**
 * Loads JSON data from a local `guest.json` file, processes it, and stores the relevant contact information in `localStorage`.
 * 
 * This function fetches the JSON data, extracts the contacts for the "Guest" category, and saves this data in `localStorage` under the key `'contacts'`.
 * After storing the data, it calls `getContactsLocally` to handle the locally stored contacts.
 * 
 * @throws {Error} Throws an error if the fetch operation fails or if there is an issue processing the JSON data.
 * 
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
 * Creates a new contact and saves it locally in the browser's localStorage.
 * 
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