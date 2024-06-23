function showContactDrp() {
    document.getElementById('assign-field').classList.toggle('border-bottom-0');
    document.getElementById('contact-drp-dwn').classList.toggle('d-none');
    document.getElementById('arrow-drp-dwn').classList.toggle('flip-vertically');
}


function prioritySelected(id, className, arrow) {
    document.getElementById(id).classList.toggle(className);
    document.getElementById(id).classList.toggle(arrow);
}