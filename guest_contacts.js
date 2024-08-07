document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem('contacts')) {
        loadJSONDataContacts();
    } else {
        getContactsLocally();
    }
});









