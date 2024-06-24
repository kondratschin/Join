function showContactDrp() {
    // document.getElementById('assign-field').classList.toggle('border-bottom-0');
    document.getElementById('contact-drp-dwn').classList.toggle('d-none');
    document.getElementById('arrow-drp-dwn').classList.toggle('flip-vertically');


}


function showCategoryDrp() {
    document.getElementById('category-field').classList.toggle('border-bottom-0');
    document.getElementById('category-drp-dwn').classList.toggle('d-none');
    document.getElementById('arrow-drp-dwn2').classList.toggle('flip-vertically');
}


function hideCategoryDrp() {
    document.getElementById('category-field').classList.remove('border-bottom-0');
    document.getElementById('category-drp-dwn').classList.add('d-none');
    document.getElementById('arrow-drp-dwn2').classList.remove('flip-vertically');
}


function hideContactDrp() {
    document.getElementById('assign-field').classList.remove('border-bottom-0');
    document.getElementById('contact-drp-dwn').classList.add('d-none');
    document.getElementById('arrow-drp-dwn').classList.remove('flip-vertically');
    document.getElementById('category-wrapper').classList.add('excludedObject');
}


function prioritySelected(id, className, arrow) {
    removeSelection(id);
    document.getElementById(id).classList.toggle(className);
    document.getElementById(id).classList.toggle(arrow);
}


function removeSelection(id) {
    if (id == 'prio-baja') {
        document.getElementById('prio-alta').classList.remove('prio-select-red');
        document.getElementById('prio-alta').classList.remove('prio-select');
        document.getElementById('prio-media').classList.remove('prio-select-orange');
        document.getElementById('prio-media').classList.remove('prio-select');
    };
    if (id == 'prio-media') {
        document.getElementById('prio-alta').classList.remove('prio-select-red');
        document.getElementById('prio-alta').classList.remove('prio-select');
        document.getElementById('prio-baja').classList.remove('prio-select-green');
        document.getElementById('prio-baja').classList.remove('prio-select');
    };
    if (id == 'prio-alta') {
        document.getElementById('prio-media').classList.remove('prio-select-orange');
        document.getElementById('prio-media').classList.remove('prio-select');
        document.getElementById('prio-baja').classList.remove('prio-select-green');
        document.getElementById('prio-baja').classList.remove('prio-select');
    };
}