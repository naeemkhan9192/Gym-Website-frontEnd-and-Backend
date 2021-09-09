'use strickmode'
window.addEventListener('DOMContentLoaded', () => {
    // console.log('Hello');
    let pageWidth = window.innerWidth;
    if (pageWidth <= 715) {
        diplayNone();
    }
});

let amburger = document.querySelector('.amburger-container');
let navbar = document.getElementById('navbar');
let profile = document.querySelector('.profile');
let navElements = document.querySelector('.element-container');
let ambur = document.querySelector('.amburger');
let dateUpdate = document.querySelector('.date');

dateUpdate.innerHTML = new Date().getFullYear();

window.addEventListener('scroll', () => {
    let scrollY = pageYOffset;
    if (scrollY >= 207) {
        navbar.style.backgroundColor = '#07193a';
    }
    else {
        navbar.style.background = 'none';

    }
});

amburger.addEventListener('click', () => {
    if (navElements.style.display === 'none') {
        diplayBlock();
    }
    else {
        diplayNone();
    }
});

function diplayNone() {
    ambur.innerHTML = '|||'
    navbar.style.height = '68px';
    navElements.style.display = 'none';
    profile.style.display = 'none';
    dashboard.style.display = 'none';
}


function diplayBlock() {
    navbar.style.height = 'auto';
    ambur.innerHTML = '&Cross;'
    navElements.style.display = 'block';
    profile.style.display = 'block';
    dashboard.style.display = 'block';
}


