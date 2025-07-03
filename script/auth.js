//get the login form from the dom element
document.getElementById('loginForm').addEventListener('submit', async function (e) {

  e.preventDefault();
  
const identifider = document.getElementById('identifier').value;
const password = document.getElementById('password').value;

const errorElem = document.getElementById('error');
errorElem.textContent = '';
})
