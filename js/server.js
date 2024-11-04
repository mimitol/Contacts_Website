function myServer(fxmlObj, value) {
    let db = new DB();
    let response = { status: "200", statusText: "", valueReturned: "" }
    if (!fxmlObj.url) {
        response.status = 400;
        response.statusText = "illegal request";
        return response;
    }
    let url = fxmlObj.url.split("/");
    if (url.length < 3) {
        response.status = 400;
        response.statusText = "illegal request";
        return response;
    }
    switch (fxmlObj.methodType) {
        case "GET":
            if (url[1] == "user") {// שקשורה למשתמש GET בקשת   
                response.valueReturned = db.getUserByPhone(url[2])
                if (response.valueReturned) {
                    response.statusText = "user found";
                    response.status = 200;
                }
                else {
                    response.statusText = "user not found";
                    response.status = 404;
                }

            }
            else if (url[1] == "contacts") {// שקשורה לאנשי קשר GET בקשת   
                if (url.length < 4) {//לא שורשר איש קשר ספציפי - כלומר בקשת כל אנשי הקשר
                    response.valueReturned = db.getAllContactsByUserPhone(url[2]);
                    if (!response.valueReturned) {
                        response.status = 404;
                        response.statusText = "contacts not found";
                    }
                    else {
                        response.status = 200;
                        response.statusText = "contacts found";
                    }
                }
                else {//של איש קשר יחיד GET שורשר מידע נוסף- כלומר חיפוש או בקשת  
                    if (url[3] == "search") {//חיפוש
                        response.valueReturned = db.getContactsByName(url[2], url[4]);
                        response.status = 200;
                        response.statusText = "contacts found";
                    }
                    else {//בקשת איש קשר יחיד
                        response.valueReturned = db.getContactByPhone(url[2], url[3])
                        if (!response.valueReturned) {
                            response.status = 404;
                            response.statusText = "contact not found";
                        }
                        else {
                            response.statusText = "contact found";
                        }
                    }

                }
            }
            return response;
        case "POST":
            if (!value) {
                response.status = 400;
                response.statusText = "illegal request";
                return response;
            }
            if (url[1] == "contact") {
                if (!db.addContact(url[2], value)) {
                    response.status = 409;
                    response.statusText = "this contact exist";
                }
                else {
                    response.statusText = "contact added";
                }
            }
            else if (url[1] == "user") {
                if (db.addNewUser(value)) {
                    response.status = 409;
                    response.statusText = "this user exist";
                }
                else {
                    response.statusText = "user added";
                }
            }
            return response;

        case "PUT":
            if (url.length < 4 || !value)// לא שורשר טלפון של איש קשר לעדכון או שלא הגיע אובייקט מעודכן
            {
                response.status = 400;
                response.statusText = "illegal request";
                return response;
            }
            response.valueReturned = db.updateContact(url[2], url[3], value);
            if (!response.valueReturned) {
                response.status = 409;
                response.statusText = "can not update contact";
            }
            else {
                response.status = 200;
                response.statusText = "contact updated";
            }
            return response;
        case "DELETE":
            if (url.length < 4)//לא שורשר טלפון של איש קשר למחיקה
            {
                response.status = 400;
                response.statusText = "illegal request";
                return response;
            }
            response.valueReturned = db.deleteContact(url[2], url[3]);
            if (!response.valueReturned) {
                response.status = 409;
                response.statusText = "The contact to delete was not found";
            }
            else {
                response.status = 200;
                response.statusText = "The contact deleted";
            }
            return response;

    }
}
