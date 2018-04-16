let navClose = document.getElementById('nav__close-button');
let nav = document.getElementById('nav');
let navOpen = document.getElementById('hamburger-menu');
let navUL = document.getElementById('nav__ul');

navUL.innerHTML = `
<li class="nav__ul__li">Home</li>
<li class="nav__ul__li">My Account</li>
<li class="nav__ul__li">Events</li>
<li class="nav__ul__li">Connections</li>
<li class="nav__ul__li">Logout</li>
`;

navClose.addEventListener('click', () => {
	nav.className = 'nav__hidden';
});

navOpen.addEventListener('click', () => {
	nav.className = 'nav__visible';
});
