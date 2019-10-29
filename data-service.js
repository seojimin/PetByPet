const fs = require('fs');

var customers = [];

//module.exports returns the result of require call //export객체에 initialize property 를 추가. 
module.exports.initialize = () => {    
    return new Promise((resolve, reject) => {
        fs.readFile('./data/customers.json', (err, data) => {
            if(err){
                reject("unable to read file");
            }
            else{
                customers = JSON.parse(data);
                resolve(); 
            }
        });        
    });
}

module.exports.getAllCustomers = () => {
    return new Promise((resolve, reject) => {
        if(customers.length == 0){
            reject("no results returned")
        }
        else{
            resolve(customers);
        }
    });
}

module.exports.addCustomers = (customerData) => new Promise((resolve, reject) => {
    try {
        customerData.customerNum = customers.length + 1;
        customers.push(customerData);
        resolve();
    }
    catch (err) {
        reject(err);
    }
});

module.exports.getCustomerByNum = (num) => new Promise((resolve, reject) => {
    try {
        if (customers.length === 0) {
            reject("unable to read file");
        }
        else {
            resolve(customers.filter(cus => cus.customerNum == num));
        }
    }
    catch (err) {
        reject(err);
    }
});

