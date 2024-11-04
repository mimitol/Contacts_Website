function network(fxmlObj, value) {
    let response=myServer(fxmlObj, value);
    fxmlObj.responseText = response.valueReturned;
    fxmlObj.status = response.status;
    fxmlObj.statusText=response.statusText;
}