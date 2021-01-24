var bcrypt = require('bcrypt');
//*require express to write handlers for requests w/ different http verbs at different url paths
const express = require('express');
//*group route handlers together and access them using common route-prefix express.router
const router = express.Router();
//*authenticate user
const basicAuth = require('basic-auth');
//*import user.js under models 
var User = require("../models").User;
app.use(express.json())
const users = []

router.get('/api/users', validateUser, function(req, res, next) {
    res.json(users)
    db.User.findOne({
        where: { password: req.password, username: req.username }
    
    }).then(function(address) {
        if(address.User !== null) {
            console.log('User name: '+address.User.name);
        } else {
            console.log('User name: NO USER');
        }

})})
//creating a new user account
router.post('/api/users', function(req, res, next) {
   const user = {name: req.body.name, password: req.body.password }
   users.push(user)
   res.status(201).send()
   if(user.password) {
       user.password = bcrypt.hash(user.password, 10);
   }
   User.create(user).then(function(user) {
       res.status(201).location('/').end();
   }).catch(function(error) {
    if(error.name === "SequelizeValidationError") {
       
    } else {
        throw error;
    }
   }).catch(function(error){
        res.status(500).send(error);
   });
}); 

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