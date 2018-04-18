let navClose = document.getElementById('nav__close-button');
let nav = document.getElementById('nav');
let navOpen = document.getElementById('hamburger-menu');
let navUL = document.getElementById('nav__ul');
//
// navUL.innerHTML = `
// <li class="nav__ul__li"><a href='/events'>Home</a></li>
// <li class="nav__ul__li"><a href='/account'>My Account</a></li>
// <li class="nav__ul__li"><a href='/events/all'>Events</li>
// <li class="nav__ul__li"><a href='/connections'>Connections</li>
// <li class="nav__ul__li">Logout</li>
// `;

navClose.addEventListener('click', () => {
	nav.className = 'nav__hidden';
});

navOpen.addEventListener('click', () => {
	nav.className = 'nav__visible';
});
