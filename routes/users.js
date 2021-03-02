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

const validateUser = async(req, res, next) => {
    const credentials = basicAuth(req);
 
    if(credentials) {
        const user = await User.findOne({ where: { email: credentials.email}});
 
        if(user) {
          const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
        }
 
        if(authenticated) {
            req.currentUser = user;
            next();
            return;
        }
    }
    res.status(401).json({message: "Incorrect email or password"});
 }

router.get('/', validateUser, function(req, res, next) {
    res.status(200).send();
//     db.User.findOne({
//         where: { password: req.password, username: req.username }
    
//     }).then(function(address) {
//         if(address.User !== null) {
//             console.log('User name: '+address.User.name);
//         } else {
//             console.log('User name: NO USER');
//         }

// })
})
//creating a new user accounts
router.post('/', async(req, res, next) => {
    console.log("user post hit")
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
    if(error.name === "SequelizeValidationError") {
        res.status(400).send(error);
    } else {
        throw error;
    }
   }).catch(function(error){
        res.status(500).send(error);
   });
}); 

module.exports = router;