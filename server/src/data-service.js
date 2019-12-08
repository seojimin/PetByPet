const Sequelize = require('sequelize');

var sequelize = new Sequelize(
    'dca74e6v63nqdp', 
    'txauqzoswjwbtd',
    '5c1461b8e888236c291b6e282f822d6a93edc2b16bf7b400641051ff7a02c45e', {
        host: 'ec2-54-204-39-43.compute-1.amazonaws.com',     
        dialect: 'postgres',     
        port: 5432,     
        dialectOptions: {         
            ssl: true     
           } 
}); 

var Customer = sequelize.define('Customer', {
    customerNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING
});

var Cat = sequelize.define('Cat', {
    catNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    DOB: Sequelize.STRING,
    sex: Sequelize.STRING,
    registerDate: Sequelize.STRING,
    customerNum: Sequelize.INTEGER
});

//module.exports returns the result of require call //export객체에 initialize property 를 추가. 
module.exports.initialize = () =>
    new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => resolve())
            .catch(() => reject("unable to sync the database"));
});

module.exports.getAllCustomers = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => Customer.findAll()
            .then(data => resolve(data))
            .catch(err => reject("no results returned"))
        );
    });
}

module.exports.getCustomerByNum = (num) => new Promise((resolve, reject) => {
    reject();     
});

module.exports.addCustomer = customerData =>
    new Promise((resolve, reject) => {
        console.log(customerData);

        //나중에 not null 체크하기
        Object.keys(customerData).forEach(key => {
            if (customerData[key] === "")
            customerData[key] = null;
        });

        sequelize.sync().then(() =>
            Customer.create(customerData)
                .then(() => resolve())
                .catch(err => reject("unable to create customer"))
        );
    });

module.exports.updateCustomer = customerData =>
    new Promise((resolve, reject) => {

        Object.keys(customerData).forEach(key => {
            if (customerData[key] === "")
            customerData[key] = null;
        });

        sequelize.sync().then(() =>
            Customer.update(Object.assign({}, customerData), {
                where: { customerNum: customerData.customerNum }
            })
                .then(() => resolve())
                .catch(err => reject("unable to update customer"))
        );
});

module.exports.deleteCustomerByNum = cusNum =>
    new Promise((resolve, reject) => {
        sequelize.sync().then(() => 
            Customer.destroy({ where: { customerNum: cusNum } })
                .then(() => resolve())
                .catch(err => reject("unable to delete customer"))
        );
    });





