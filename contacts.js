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


function mobileFadeIn(id) {
    document.getElementById(id).classList.remove('mobileOptionFadeOut');
    document.getElementById(id).classList.add('mobileOptionFadeIn');
}


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


function deleteContactLocally(name) {
    let contacts = JSON.parse(localStorage.getItem('contacts')) || {};
    delete contacts[name];
    localStorage.setItem('contacts', JSON.stringify(contacts));
    getContactsLocally();
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


function showContactDetailsMobile() {
    document.getElementById('contactsRightsideContent').classList.remove('d-none');
    document.getElementById('contactsContent').classList.add('d-none');
    addEventlistenerMobileMenu();
}


function backToContactList() {
    document.getElementById('contactsRightsideContent').classList.add('d-none');
    document.getElementById('contactsContent').classList.remove('d-none');
}


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


function showMobileOptions(id) {
    appear(id);
    mobileFadeIn(id);
}

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


function getContactsLocally() {
    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    let contactsAsArray = Object.keys(contacts);
    sortContactlist(contacts, contactsAsArray);
    if (window.location.pathname.endsWith('contacts.html')) {
        showContactsInList();
    }
    // Uncomment the line below if `checkWidthAndAddClickListener` is needed in this context.
    // checkWidthAndAddClickListener();
}


function loadJSONDataContacts() {
    fetch('guest.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('contacts', JSON.stringify(data.contacts.Guest));
            getContactsLocally();
        })
        .catch(error => console.error('Error loading JSON data:', error));
}


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
    if (accName && accName.trim() !== '') {
        if (!localStorage.getItem('contacts')) {
            loadJSONDataContacts();
        } else {
            getContactsLocally();
        }
    }
});