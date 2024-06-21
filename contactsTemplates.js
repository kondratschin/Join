function printContactAlphabethicContainer(sortLetterNr) {
    contactCarts.innerHTML += `
    <div class="contactSort">
        <p>
            ${sortLetterNr['letter']}
        </p>
    </div>
`;
}


function setBackgroundColor() {
    let colorElement = document.getElementsByClassName('initialsContactCart');
    for (let i = 0; i < colorElement.length; i++) {
        const element = colorElement.item(i);
        let hue = Math.random() * 360;
        let randomColor = `hsl(${hue}, 70%, 50%)`
        
        element.style.background = randomColor;
    }
}


function printContact(LetterContactNr) {
    contactCarts.innerHTML += `
        <div class="contactCart">
            <div class="initialsContactCart">
                <p id="contactCartInitals">${LetterContactNr['name'].match(/\b(\w)/g).join('')}</p>
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