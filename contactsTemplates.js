function printContactAlphabethicContainer(sortLetterNr) {
    contactCarts.innerHTML += `
    <div class="contactSort">
        <p>
            ${sortLetterNr['letter']}
        </p>
    </div>
`;
}


function printContact(LetterContactNr) {
    contactCarts.innerHTML += `
        <div class="contactCart">
            <div class="initialsContactCart">
                <p id="contactCartInitals">AB</p>
            </div>
            <div class="nameAndEmail">
                <p class="contactCartName" id="contactCartName">
                    ${LetterContactNr['name']}
                </p>
            <span id="contactCartEmail" style="color: #29ABE2;">${LetterContactNr['email']}</span>
            </div>
        </div>
    `;
}