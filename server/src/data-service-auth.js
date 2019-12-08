var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

var userSchema = new Schema({
    userName: {
        type: String,
        unique: true
    },
    password: String,
    email: String,
    loginHistory: [{
        dateTime: Date,
        userAgent: String
    }]
});

let User;

module.exports.initialize = () =>
    new Promise((resolve, reject) => {
        let db = mongoose.createConnection('mongodb://petbypet:p12345@ds241288.mlab.com:41288/petbypet');
        db.on('error', err => {
            reject(err);
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        })
    });

module.exports.registerUser = userData =>
    new Promise((resolve, reject) => {

        bcrypt.genSalt(10, (err, salt) => {
            if (err)
                reject(`There was an error encrypting the password ${err}`);
            bcrypt.hash(userData.password, salt, (err, hash) => {
                if (err)
                    reject(`There was an error encrypting the password ${err}`);
                userData.password = hash;

                let newUser = new User(userData);
                newUser.save(err => {
                    if (err) {
                        if (err.code == 11000) //mongo DB error code
                            reject(`Username ${userData.userName} already taken.`);

                        reject(`"There was an error creating the user: ${err}`)
                    }
                    resolve();
                });
            })
        })
    });

module.exports.checkUser = userData =>
    new Promise((resolve, reject) => {
        User.findOne({ userName: userData.userName })
            .exec()
            .then(user => {
                if (user === null)
                    reject(`Unable to find user: ${userData.userName}`);
                
                bcrypt.compare(userData.password, user.password)
                    .then(result => {
                        if(!result)
                        reject(`Incorrect Password for user: ${userData.userName}`);
                        user.loginHistory.push({
                            dateTime: new Date().toString(),
                            userAgent: userData.userAgent
                        });
        
                        User.update({ userName: userData.userName },
                            { $set: { loginHistory: user.loginHistory } },
                            { multi: false }, (err, raw) => {
                                if (err) {
                                    reject(`There was an error verifying the user: ${err}`);
                                }
                                else
                                    resolve(user);
                            })
                    })
            })
            .catch(err => reject(err));
    });
