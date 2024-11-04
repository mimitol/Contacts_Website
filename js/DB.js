class DB {
    //רישום משתמש חדש
    addNewUser(newUser) {
        let usersArray = JSON.parse(localStorage.getItem("users")) || [];
        // בדיקה האם המשתמש כבר רשום
        let ifExist = usersArray.some(u => u.phone == newUser.phone);
        if (!ifExist) {
            usersArray.push(newUser);
            localStorage.setItem("users", JSON.stringify(usersArray));//דחיפת מערך המשתמשים ללוקל סטורג' 
            let contactsArr = [];
            localStorage.setItem(newUser.phone, JSON.stringify(contactsArr));//דחיפת מערך אנשי קשר למשתמש החדש ללוקל סטור
        }
        return ifExist;
    }

    // שליפת כל אנשי הקשר של משתמש מסוים
    getAllContactsByUserPhone(userPhone) {
        let contacts = localStorage.getItem(userPhone);
        return contacts;
    }

    //שליפת משתמש לפי מספר פלאפון
    getUserByPhone(userPhone) {
        let allUsers = JSON.parse(localStorage.getItem("users"));
        if (allUsers) {
            for (let u of allUsers) {
                if (u.phone == userPhone) {
                    return u;
                }
            }
        }
        return false;
    }

    // שליפת איש קשר של משתממש ע"פ מס פלאפון של איש קשר
    getContactByPhone(userPhone, contactPhone) {
        let contactsArray = (JSON.parse(this.getAllContactsByUserPhone(userPhone)));
        for (let c of contactsArray) {
            if (c.phone == contactPhone) {
                return c;
            }
        }
    }

    //חיפוש אנשי קשר
    getContactsByName(userPhone, name) {
        let contactsArray = (JSON.parse(this.getAllContactsByUserPhone(userPhone)));
        let filteredContacts = contactsArray.filter(contact => {
            const nameMatch = contact.firstName.toLowerCase().includes(name.toLowerCase());
            const surnameMatch = contact.lastName.toLowerCase().includes(name.toLowerCase());
            return nameMatch || surnameMatch;
        });
        return filteredContacts;
    }

    //הוספת איש קשר חדש
    addContact(userPhone, newContact) {
        let contactsArray = JSON.parse(this.getAllContactsByUserPhone(userPhone));
        //בדיקה אם איש קשר כבר קיים
        let ifExist = (contactsArray.some(u => u.phone == newContact.phone));
        if (!ifExist) {     //אם לא קיים כבר
            let indexToInsert = contactsArray.findIndex(contact => {//חיפוש האינדקס המתאים להכנסת איש קשר חדש
                const firstNameComperation = contact.firstName.localeCompare(newContact.firstName);
                if (firstNameComperation != 0) {
                    return firstNameComperation > 0;
                }
                return contact.lastName.localeCompare(newContact.lastName) > 0;
            });
            //דחיפה למערך אנשי קשר
            if (indexToInsert == -1) {
                contactsArray.push(newContact);
            }
            else {
                contactsArray.splice(indexToInsert, 0, newContact);
            }
            localStorage.setItem(userPhone, JSON.stringify(contactsArray));
            return true;
        }
        //אם איש קשר קיים- לא ניתן להוסיף אותו
        return false;
    }

    //מחיקת איש קשר
    deleteContact(userPhone, contactPhoneToDelete) {
        let contactsArray = (JSON.parse(this.getAllContactsByUserPhone(userPhone)));
        //חיפוש האינדקס של האיש קשר למחיקה
        const indexToRemove = contactsArray.findIndex((contact) => contact.phone == contactPhoneToDelete);
        if (indexToRemove != -1) {//אם נמצא האינדקס למחיקה- מחק
            contactsArray.splice(indexToRemove, 1);
            localStorage.setItem(userPhone, JSON.stringify(contactsArray));
            return true;
        }
        //לא נמצא איש הקשר המבוקש למחיקה
        return false;
    }

    //עידכון איש קשר, הפונקציה מקבלת: מס' פלאפון של משתמש נוכחי, מס' פלאפון של איש הקשר אותו יש לעדכן ואובייקט איש קשר מעודכן
    updateContact(userPhone, phoneToUpdate, contactToUpdate) {
        let contactsArray = (JSON.parse(this.getAllContactsByUserPhone(userPhone)));
        //חיפוש האינדקס של איש הקשר לעידכון במערך אנשי הקשר
        const indexToReplace = contactsArray.findIndex((contact) => contact.phone == phoneToUpdate);
        //בדיקה אם כבר קיים מספר פלאפון כמו המספר המעודכן
        const ifExist = contactsArray.some((contact, index) => index != indexToReplace && contact.phone == contactToUpdate.phone);
        if (!ifExist) {
            contactsArray[indexToReplace] = contactToUpdate;
            contactsArray = this.sortAfterUpdate(contactsArray);
            localStorage.setItem(currentUser.phone, JSON.stringify(contactsArray));
        }
        return !ifExist;
    }
    
    //מיון מערך אנשי קשר
    sortAfterUpdate(contactsArray) {
        contactsArray.sort((contact1, contact2) => {            
            let firstNameComparison = contact1.firstName.localeCompare(contact2.firstName);
            if (firstNameComparison !== 0) {
                return firstNameComparison;
            }
            //אם לפי שם פרטי אין צורך לעשות לעשות החלפה, בודק לפי שם משפחה
            return contact1.lasttName.localeCompare(contact2.lastName);
        });
        return contactsArray;
    }

}
