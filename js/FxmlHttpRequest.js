class FxmlHttpRequest{
    constructor(){
       this.methodType;
       this.url;
       this.responseText;
       this.status;
       this.statusText;
    }
    open(type, url)
    {
        this.url=url;
        this.methodType=type;
    }
    send(value)
    {
        network(this,value);
    }
    onload(functionToExe)
    {
        functionToExe(this);
    }
}
