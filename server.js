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
    dataService.addCustomers(req.body)
        .then(res.redirect("/customers"))
        .catch((err) => console.log(err));
});

dataService.initialize()
    .then(() => app.listen(HTTP_PORT, onHttpStart))
    .catch(() => console.log('some error occured')); 

