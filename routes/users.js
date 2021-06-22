var bcrypt = require('bcryptjs');
//*require express to write handlers for requests w/ different http verbs at different url paths
const express = require('express');
//*group route handlers together and access them using common route-prefix express.router
const router = express.Router();
//*authenticate user
const basicAuth = require('basic-auth');
//*import user.js under models 
var User = require("../models").User;

const users = []
//check user credentials
const authenticateUser = async(req, res, next) => {
    const credentials = basicAuth(req);
    console.log(credentials);
    if(credentials) {
        //find user with matching email address/username
        const user = await User.findOne({ where: { emailAddress: credentials.name}});
        console.log(user)
        //if user with matching email is found, compare the user input for password to the password stored in the database
        if(user) {
          const authenticated = bcrypt.compareSync(credentials.pass, user.password);   
          //if both credentials pass,save user info to request object 
          if(authenticated) {
            req.currentUser = user;
            next();
            return;
        }
        }

    }
    res.status(401).json({message: "Incorrect email or password"});
 }
//returns the current user
router.get('/', authenticateUser, function(req, res, next) {
    res.status(200).send({id: req.currentUser.id, firstName:req.currentUser.firstName, lastName: req.currentUser.lastName, emailAddress:req.currentUser.emailAddress});
})
//creating a new user accounts
router.post('/', async(req, res, next) => {
    console.log("user post hit")
        var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!req.body.emailAddress.match(mailformat))
        {
        res.status(400).send("You have entered an invalid email address!");
        return;
        }
   const user = {firstName: req.body.firstName, lastName:req.body.lastName , emailAddress: req.body.emailAddress, password: req.body.password }
   console.log(req.body.firstName);
   //users.push(user)
   //res.status(201).send()
   if(user.password) {
       //hashing newly made password
       user.password = await bcrypt.hash(user.password, 10);
       console.log(user.password)
   }
   //putting user info into database
   User.create(user).then(function(user) {
       res.status(201).location('/').end();
   }).catch(function(error) {
    if(error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
        res.status(400).send(error);
    } else {
        throw error;
    }
   }).catch(function(error){
        res.status(500).send(error);
   });
}); 

module.exports = router;