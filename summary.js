 function load(){
    loadTaskData();
    goodMorningText()
 }

 async function loadTaskData() {
    let name = localStorage.getItem('userName');
    console.log(name); // Überprüfen, ob der Name korrekt geladen wird

    if (name) {
        try {
            // Pfad zur spezifischen Aufgabe des Benutzers in der Firebase Realtime Database
            const taskUrl = `https://join-fda66-default-rtdb.europe-west1.firebasedatabase.app/tasks/${name}.json`;
            
            let response = await fetch(taskUrl);
            if (response.ok) {
                let tasks = await response.json();
                console.log(tasks); // Ausgabe der Aufgabendaten in der Konsole
            } else {
                console.error('Failed to fetch tasks:', response.status);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    } else {
        console.log('No username found in localStorage');
    }
}

function goodMorningText() {
    let name = localStorage.getItem('userName');

    // Check if 'name' is not null and is not an empty string
    if (name && name !== "null") {
        // If there is a name, update the 'name' element
        document.getElementById('name').innerHTML = `${name}`;
    } else {
        // If there is no name, just say "Good morning"
        document.getElementById('goodMorningText').innerHTML = "Good morning";
    }
}
