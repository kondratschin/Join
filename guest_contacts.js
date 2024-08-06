let accName = getName();
let contacts = [];
let alphabetContainer = [];

window.addEventListener("resize", checkWidthAndAddClickListener);

document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem('contacts')) {
        loadJSONData();
    } else {
        getContacts();
    }
});

function getName() {
    let name = localStorage.getItem('userName');
    return name;
}

function displayNone(id) {
    document.getElementById(id).classList.add('d-none');
}

function displayElement(id) {
    document.getElementById(id).classList.remove('d-none');
}

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

function clearInput() {
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
}

function addSubmitEvent() {
    document.getElementById('addContactInputForm').addEventListener('submit', function (event) {
        event.preventDefault();

        let contactName = document.getElementById('contactName').value;
        let contactEmail = document.getElementById('contactEmail').value;
        let contactPhone = document.getElementById('contactPhone').value;

        createContact(contactName, contactEmail, contactPhone);
    });
}

function addEditSubmitEvent(color, oldName) {
    document.getElementById('editContactInputForm').addEventListener('submit', function (event) {
        event.preventDefault();

        let contactName = document.getElementById('contactName').value;
        let contactEmail = document.getElementById('contactEmail').value;
        let contactPhone = document.getElementById('contactPhone').value;

        editContact(contactName, contactEmail, contactPhone, color, oldName);
    });
}

function createContact(contactName, contactEmail, contactPhone) {
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
    getContacts();
    vanishAddConact();
}

function editContact(contactName, contactEmail, contactPhone, contactColor, oldName) {
    let initials = contactName.match(/\b(\w)/g).join('');
    let editData = {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        color: contactColor
    };
    delete contacts[oldName];
    contacts[contactName] = editData;
    localStorage.setItem('contacts', JSON.stringify(contacts));
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
        alphabetContainer.push({
            letter: String.fromCharCode(i),
            list: []
        });
    }
}

function getContacts() {
    contacts = JSON.parse(localStorage.getItem('contacts')) || {};
    let contactsAsArray = Object.keys(contacts);
    sortContactlist(contacts, contactsAsArray);
    showContactsInList();
    checkWidthAndAddClickListener();
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
        alphabetChar['list'].push({
            name: responseAsJson[contactsAsArray]['name'],
            email: responseAsJson[contactsAsArray]['email'],
            phone: responseAsJson[contactsAsArray]['phone'],
            color: responseAsJson[contactsAsArray]['color'],
        });
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

function deleteContact(name) {
    delete contacts[name];
    localStorage.setItem('contacts', JSON.stringify(contacts));
    getContacts();
    clearShowDetails();
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

function loadJSONData() {
    fetch('guest.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('contacts', JSON.stringify(data.contacts.Guest));
            localStorage.setItem('tasks', JSON.stringify(data.tasks.Guest));
            getContacts();
        })
        .catch(error => console.error('Error loading JSON data:', error));
}