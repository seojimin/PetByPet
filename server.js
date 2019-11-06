var HTTP_PORT = process.env.PORT || 8080;

var dataService = require('./data-service.js');
var bodyParser = require('body-parser');
var express = require('express'); //Node.js web app framework 
var app = express();

function onHttpStart(){
    console.log('Express http server listening on ' + HTTP_PORT); //current 8080
}

app.get("/", function(req, res){
    res.send('PetByPet');
});

app.get("/customers", function(req, res){
    dataService.getAllCustomers()
        .then(data => res.json(data))
        .catch((err) => console.log(err));
});

//Run this on ALL requests
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(404).send('Error');
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.post("/customers/add", function(req, res) {
    console.log(req.body);
    dataService.addCustomer(req.body)
        .then(res.redirect("/customers"))
        .catch((err) => console.log(err));
});

app.post("/customers/update", function (req, res){
    let newCustomerData = req.body;

    dataService.updateCustomer(newCustomerData)
        .then(data => res.redirect("/customers"))
        .catch(err => res.status(500).send("error occurred"));
});

dataService.initialize()
    .then(() => app.listen(HTTP_PORT, onHttpStart))
    .catch(() => console.log('some error occured')); 

app.get("/customers/:value", function (req, res) {
    let number = req.params.value;
    console.log(number);
    dataService.getCustomerByNum(number)
        .then(data => res.json(data))
        .catch((err) => console.log(err))
});

app.delete("/customers/delete/:cusNum", function (req, res){
    let empNum = req.params.empNum;
    dataService.deleteCustomerByNum(empNum)
        .then(() => res.redirect("/customers"))
        .catch(() => res.status(500).send("Unable to Remove Customer / Customer not found"));
});



    
