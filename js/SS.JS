function myServer(xmlObj, value) {
    let db = new DB();
    let response = { status: "200", statusText: "", valueReturned: "" }
    if(!xmlObj.url) {
        response.status = 400;
        response.statusText = "illegal request";
        return response;
    }
    let url = xmlObj.url.split("/");
    if(url.length<3)
    {
        response.status = 400;
        response.statusText = "illegal request";
        return response;
    }
    switch (xmlObj.methodType) {
        case "GET":
            if (url[1] == "contacts") {
                if (url.length == 4) {
                    response.statusText=200;
                    response.statusText="value found";
                    response.valueReturned= db.getContactByPhone(url[2],url[3])
                    return { status: 200, statusText: "value found", valueReturned: db.getContactByPhone(url[2],url[3]) };
                } else
                    if (url[2]) {
                        if (url.length >= 3 && url[3] == "search") {
                            response.valueReturned = db.getContactsByName(url[2], url[4]);
                            if (!response.valueReturned) {
                                response.status = 404;
                                response.statusText = "value not found";
                            }
                            else {
                                response.statusText = "succeed";
                            }
                        }
                        else {
                            response.valueReturned = db.getAllContactsByUserPhone(url[2]);
                            if (!response.valueReturned) {
                                response.status = 404;
                                response.statusText = "value not found";
                            }
                            else {
                                response.statusText = "succeed";
                            }
                        }

                    }
                    else {
                        response.status = 404;
                        response.statusText = "illegal request";

                    }
            }
            else if (url[1] == "user") {
                if (url[2]) {
                    response.valueReturned = db.getUserByPhone(url[2])
                    if (response.valueReturned) {
                        response.statusText = "value found";
                    }
                    else {
                        response.valueReturned = "";
                        response.status = 404;
                        response.statusText = "value not found";
                    }
                }
            }
            return response;
        case "POST":
            if (url[1] == "contact") {
                if (!db.addContact(url[2], value)) {
                    response.status = 409;
                    response.statusText = "value exist";
                }
                else {
                    response.statusText = "success";
                }
            }
            else if (url[1] == "user") {
                if (db.addNewUser(value)) {
                    response.status = 409;
                    response.statusText = "value exist";
                }
                else {
                    response.statusText = "success";
                }
            }
            return response;
            break;

        case "PUT":
            response.valueReturned = db.updateContact(url[2], url[3], value);
            if (response.valueReturned) {
                response.status = 409;
                response.statusText = "value exist";
            }
            else {
                response.statusText = "value updated";
            }
            return response;
        case "DELETE":
            db.deleteContact(url[2], url[3])
            return { status: 200, statusText: "value deleted", valueReturned: "" };
            break;
    }
}

function GET() {
    return localStorage.getItem("users");
}