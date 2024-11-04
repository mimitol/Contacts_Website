function regex(isPhoneValid, isPasswordValid) {
    const phoneRegex = /^\d{10}$/; //  ביטוי רגולרי לבדיקת מספר פלאפון. תנאי: 10 ספרות
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/; // בטוי רגולי לבדיקת סיסמא. תנאי: עם לפחות 8 תווים, אות אחת גדולה, אות קטנה אחת ומספר אחד
    isPhoneValid = phoneRegex.test(isPhoneValid);
    if (!isPhoneValid) {
        alert('Please enter a valid 10-digit phone number');
        return false;
    }
    if (isPasswordValid) {
        isPasswordValid = passwordRegex.test(isPasswordValid);
        if (!isPasswordValid) {
            alert('Please enter a password with at least 8 characters, one uppercase letter, one lowercase letter, and one number');
            return false;
        }
    }
    return true;
}

//הצגת תווי הסיסמא על המסך
function showPassword() {
    let showCheckbox = document.getElementById("showCheckbox");
    if (showCheckbox.checked == true) {
        document.getElementById("password").type = "text";
        if (document.getElementById("passwordVerify")) {
            document.getElementById("passwordVerify").type = "text";
        }
    }
    else {
        document.getElementById("password").type = "password";
        if (document.getElementById("passwordVerify")) {
            document.getElementById("passwordVerify").type = "password";
        }
    }
}
//בדיקת אימות הסיסמא
function checkVerifyPassword() {
    if ((document.getElementById("password").value) != (document.getElementById("passwordVerify").value)) {
        alert("The  verify password is not correct!");
        document.getElementById("passwordVerify").value = "";
    }
}

//בדיקת ססטוס קריאת השרת
function checkStatus(responseXml) {

    if (responseXml.status != 200) {
        if (responseXml.statusText == "illegal request") {
            console.log("illegal request");
        }
        else if (responseXml.statusText == "this contact exist") {
            throw "The contact you tried to add already exists";
        }
        else if (responseXml.statusText == "this user exist") {
            throw "you are a registered user, please log in";
        }
        else if (responseXml.statusText == "user not found") {
            throw "you are not a registered user, please sign up";
        }
        else if (responseXml.statusText == "user not found") {
            throw "you are not a registered user, please sign up";
        }
        else if (responseXml.statusText == "can not update contact") {
            throw "you tried to change the phone number to a phone number that exists in your contacts"
        }
        else {
            throw "uncaught error";
        }
    }
}

//פןנקציה שאוספת את נתוני משתמש חדש מהמסך 
function submitNewUser() {
    const signUpForm = document.getElementsByTagName("form")[0];
    if (regex(signUpForm['phone'].value, signUpForm['password'].value)) {
        let newUser = {
            userName: signUpForm['username'].value,
            phone: signUpForm['phone'].value,
            email: signUpForm['email'].value,
            password: signUpForm['password'].value,
        };

        try {
            // POST קריאת שרת 
            fxml = new FxmlHttpRequest();
            fxml.open("POST", "httpContactProject/user/ ");
            fxml.send(newUser);
            fxml.onload(checkStatus);
            sionsesStorage.setItem("currentUser", JSON.stringify(newUser));//דחיפת משתמש נוכחי ללוקל סטורג'
            moveToContactPage();
            showUserName();
        }
        catch (err) {
            alert(err);
            moveToLogInPage();
        }
    }
}

//פונקצייה שמטפלת בכניסה למערכת של משתמש רשום
function submitUser(e) {
    e.preventDefault();
    const logInForm = document.getElementById('logInForm');
    let phone = logInForm["phone"].value;
    let password = logInForm["password"].value;
    //קריאה לפונקציה הבודקת אם המשתמש אכן קיים
    try {
        fxml = new FxmlHttpRequest();
        fxml.open("GET", "httpContactProject/user/" + phone);
        fxml.send();
        fxml.onload(checkStatus);
        let currentUser = fxml.responseText;
        try {
            if (currentUser.password != password) {
                logInForm["password"].value = '';
                throw "wrong password!";
            }
            sessionStorage.setItem("currentUser", JSON.stringify(currentUser));//דחיפת משתמש נוכחי ללוקל סטורג'
            //מעבר לעמוד הצגת אנשי קשר
            moveToContactPage();
            //קריאה לפונקציה שמציגה אנשי קשר של משתמש
            showAllContacts();
            //קריאה לפונקציה המציגה את שם המשתמש על המסך
            showUserName();
        }
        catch (err) {
            alert(err);
        }
    }
    catch (err) {
        alert(err);
        //מעבר לעמוד הרשמה
        moveTosignUpPage();
    }
}

function showUserName() {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    document.getElementById("label").innerHTML += "Hello " + currentUser.userName;
}

function showAllContacts(byFilter) {
    try {
        clearTable();
        currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
        //שליפת משתמש עכשווי
        if (byFilter) {
            //שליפת השם לחיפוש
            let nameToSearch = document.getElementById("search").value;
            fxml = new FxmlHttpRequest();
            fxml.open("GET", "httpContactProject/contacts/" + currentUser.phone + "/search/" + nameToSearch);
            fxml.send();
            fxml.onload(checkStatus);
            contacts = fxml.responseText;
        }
        else {
            document.getElementById("search").value = "";
            fxml = new FxmlHttpRequest();
            fxml.open("GET", "httpContactProject/contacts/" + currentUser.phone);
            fxml.send();
            fxml.onload(checkStatus);
            contacts = JSON.parse(fxml.responseText);
        }

        for (let c of contacts) {
            let row = document.createElement("tr");

            let firstName = document.createElement("td");
            firstName.textContent = c.firstName;
            row.appendChild(firstName);

            let lastName = document.createElement("td");
            lastName.textContent = c.lastName;
            row.appendChild(lastName);

            let phone = document.createElement("td");
            phone.textContent = c.phone;
            row.appendChild(phone);

            let email = document.createElement("td");
            email.textContent = c.email;
            row.appendChild(email);

            let buttons = document.createElement("td");
            let updateBtn = document.createElement("button");
            updateBtn.textContent = "update";
            updateBtn.onclick = function sendToUpdate() {
                showContactForm(this.parentNode.parentNode.childNodes[2].textContent);
            };
            buttons.appendChild(updateBtn);
            let deleteBtn = document.createElement("button");
            deleteBtn.textContent = "delete";
            deleteBtn.onclick = function sendToDelete() {
                let row = this.parentNode.parentNode;
                deleteContact(row.childNodes[2].textContent);
            };
            buttons.appendChild(deleteBtn);
            row.appendChild(buttons);
            document.getElementById('contactsTbody').appendChild(row);
        }
    }
    catch (err) {
        alert(err);
    }
}

//פונקציה להוספה/עדכון איש קשר
function submitContant(e) {
    e.preventDefault();
    currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    let contactForm = document.getElementById("contactForm");
    if (!regex(contactForm['phone'].value)) {
        contactForm['phone'].value = "";
        return;
    }
    let contact = {
        firstName: contactForm['firstName'].value,
        lastName: contactForm['lastName'].value,
        phone: contactForm['phone'].value,
        email: contactForm['email'].value,
    };
    try {
        let titleForm = document.getElementById("contactFormTitle").innerHTML;

        titleForm = titleForm.split(" ");
        if (titleForm[0] == "Add") {//קריאת שרת מסוג POST
            fxml = new FxmlHttpRequest();
            fxml.open("POST", "httpContactProject/contact/" + currentUser.phone);
            fxml.send(contact);
            fxml.onload(checkStatus);
        }
        else {
            //קריאת שרת מסוג PUT
            fxml = new FxmlHttpRequest();
            fxml.open("PUT", "httpContactProject/contact/" + currentUser.phone + "/" + titleForm[2]);
            fxml.send(contact);
            fxml.onload(checkStatus);
        }
        contactForm.reset();
        //רענון תצוגה        
        closeContactForm();
        clearTable();
        showAllContacts();
    }
    catch (err) {
        alert(err);
    }
}

//מחיקת איש קשר
function deleteContact(contactPhoneToDelete) {
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    try {//קריאת שרת DELETE
        fxml = new FxmlHttpRequest();
        fxml.open("DELETE", "httpContactProject/contact/" + currentUser.phone + "/" + contactPhoneToDelete);
        fxml.send();
        fxml.onload(checkStatus);
    }
    catch (err) {
        alert(err);
    }
    //רענון תצוגה
    clearTable();
    showAllContacts();
}

function showContactForm(contactPhone) {
    let updateContactForm = document.getElementById('contactForm');
    updateContactForm.style.display = "block";
    if (contactPhone) {
        let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
        fxml = new FxmlHttpRequest();
        fxml.open("GET", "httpContactProject/contacts/" + currentUser.phone + "/" + contactPhone);
        fxml.send();
        fxml.onload(checkStatus);
        let contactToUpdate = fxml.responseText;
        updateContactForm["firstName"].value = contactToUpdate.firstName;
        updateContactForm["lastName"].value = contactToUpdate.lastName;
        updateContactForm["phone"].value = contactToUpdate.phone;
        updateContactForm["email"].value = contactToUpdate.email;
        updateContactForm["addContactSubmit"].textContent = "Save Changes";
        document.getElementById("contactFormTitle").innerHTML = "Update Contact: " + contactToUpdate.phone;
    }
    else {
        updateContactForm["addContactSubmit"].textContent = "Save";
        document.getElementById("contactFormTitle").innerHTML = "Add Contact";
    }
}

//סגירת טופס הוספת/הצגת איש קשר
function closeContactForm(e) {
    if (e) {
        e.preventDefault();
    }
    let contactForm = document.getElementById('contactForm');
    contactForm.reset();
    contactForm.style.display = "none";
}

//פונקציה שמרוקנת את טבלת אנשי הקשר מהמסך
function clearTable() {
    let table = document.getElementById("contactsTbl")
    const rows = table.getElementsByTagName('tr');
    for (let i = rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}