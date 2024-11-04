const signUpLink = document.getElementById("signUpLink");
const logInLink = document.getElementById("logInLink");
const container = document.getElementsByClassName('container')[0];
const signUpTemplate = document.getElementById('signUpTemplate');
const logInTemplate = document.getElementById('logInTemplate');
const contactsTemplate = document.getElementById('contactsTemplate');

// Show signUp page by default
signUpLink.className += ' active';
container.appendChild(document.importNode(signUpTemplate.content, true));

// Switch between pages
signUpLink.addEventListener('click', moveTosignUpPage);
function moveTosignUpPage(){
    document.title = "Sign Up";
    signUpLink.className = 'active';
    logInLink.className = '';
  //  contactsLink.className = '';
    container.innerHTML = '';
    container.appendChild(document.importNode(signUpTemplate.content, true));
}



logInLink.addEventListener('click', moveToLogInPage);
function moveToLogInPage() {
    document.title = "Log In";
    signUpLink.className = '';
    logInLink.className = 'active';
   // contactsLink.className = '';
    container.innerHTML = '';
    container.appendChild(document.importNode(logInTemplate.content, true));
};

function moveToContactPage() {
    document.title = "Contacts";
    signUpLink.className = '';
    logInLink.className = '';
    //contactsLink.className = 'active';
    container.innerHTML = '';
    container.appendChild(document.importNode(contactsTemplate.content, true));
   
};

