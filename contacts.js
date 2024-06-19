const BASE_URL = "https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/";
let popup = document.getElementById('addContactPopup');


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




async function createContact(name, email, phone, accName) {
    let newContact = {
        name: name,
        email: email,
        phone: phone
    };
    let response = await fetch(BASE_URL + "contacts/" + accName + "/" + name + ".json", {
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
    }
}


function addSubmitEvent() {
    document.getElementById('addContactInputForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        // Prevent default form submission
    
        // Get form values
        let accName = 'Mike Mayer';
        let name = document.getElementById('addContactName').value;
        let email = document.getElementById('addContactEmail').value;
        let phone = document.getElementById('addContactPhone').value;
    
        // Call the signUp function
        await createContact(name, email, phone, accName);
    });
}


function showAddContact(id) {
    displayElement(id);
    addSubmitEvent();
}