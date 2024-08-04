/**
 * Generates the HTML content for a contact.
 * @param {Object} letterContactNr - The contact information.
 * @param {number} y - The index in the sorted list.
 * @param {number} i - The index in the alphabetContainer.
 * @returns {string} - The HTML string for the contact.
 */
function createContactHtml(LetterContactNr, y, i) {
    let color = LetterContactNr['color'];
    let initials = LetterContactNr['name'].match(/\b(\w)/g).join('');
    let name = LetterContactNr['name'];

    return /*html*/ `
        <div onclick="highlightContact(${i}, ${y})" id="contact-in-list${i}-${y}" class="contact-in-list pddng-12">
            <div class="flex-center">
                <div class="initialsContact-small" style="background: ${color}">${initials}</div>
                <span class="pddng-lft-12">${name}</span>
            </div><img id="check-button${i}-${y}" src="./img/check-button.svg" alt="">
            <img id="checked-button${i}-${y}" class="d-none" src="./img/checked-button.svg" alt="">
        </div>
    `;
}


/**
 * Generates the HTML content for the subtask list.
 * @param {Array} subTaskList - The list of subtasks.
 * @param {number} startIndex - The starting index for rendering the list.
 * @returns {string} - The HTML string for the subtask list.
 */
function createSubTaskListHtml(subTaskList, startIndex) {
    let htmlContent = '';

    // Loop through the last two (or less) items in subTaskList
    for (let i = startIndex; i < subTaskList.length; i++) {
        let subTask = subTaskList[i];

        htmlContent += /*html*/ `
            <div id="sub-task-entry${i}" class="highlight-subtask sub-task-entry">
                <li id="subtask-in-list${i}">${subTask.name}</li>
                <div class="sub-task-buttons" style="display: none">
                    <img id="edit-small-img${i}" onclick="editTaskInList(${i})" class="plus" src="./img/edit-small.svg" alt="">
                    <img src="./img/separator-small.svg" class="sep-small" alt="">
                    <img id="recycle-small-img${i}" onclick="deleteSubtaskHTML(${i})" class="plus" src="./img/recycle.svg" alt="">
                </div>
            </div>
        `;
    }

    return htmlContent;
}