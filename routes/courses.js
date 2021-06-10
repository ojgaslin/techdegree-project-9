var bcrypt = require('bcryptjs');
//*require express to write handlers for requests w/ different http verbs at different url paths
const express = require('express');
//*group route handlers together and access them using common route-prefix express.router
const router = express.Router();
//*import course.js under models 
var Course = require("../models").Course;
//*authenticate user
const basicAuth = require('basic-auth');
//*import user.js under models 
var User = require("../models").User;

const authenticateUser = async(req, res, next) => {
  const credentials = basicAuth(req);
  console.log(credentials);
  if(credentials) {
      const user = await User.findOne({ where: { emailAddress: credentials.name}});
      console.log(user)
      if(user) {
        const authenticated = bcrypt.compareSync(credentials.pass, user.password);
         
      if(authenticated) {
          req.currentUser = user;
          next();
          return;
      }
      }

  }
  res.status(401).json({message: "Incorrect email or password"});
}
//*returns courses and the user that owns each course
router.get('/', async(req, res, next) => {
    const courses = await Course.findAll({
    attributes:['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId' ],
     include: {model: User, as:'user', attributes:['id', 'firstName', 'lastName', 'emailAddress' ]} });
    res.status(200).json(courses);
})
//*returns the course and course owner when given the course ID
router.get('/:id', async(req, res, next) => {
    const course = await Course.findByPk(req.params.id, {
      attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
      include: {model: User, as:'user', attributes:['id', 'firstName', 'lastName', 'emailAddress' ]} });
      res.status(200).json(course);
 });

// //*creates a course and sets the location header to the URL for the course
router.post('/', authenticateUser, async(req, res, next) => {
 const course = {id: req.body.id, title: req.body.title, description:req.body.description , estimatedTime: req.body.estimatedTime, materialsNeeded: req.body.materialsNeeded, createdAt: req.body.createdAt, updatedAt: req.body.updatedAt, userId: req.body.userId }
 //putting course info into database
 console.log(req.body)
 Course.create(course).then(function(course) {
     res.status(201).location( '/api/courses/'+ course.id).end();
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

router.put('/:id', authenticateUser, function(req, res, next) {
  console.log(req.params.id)
  //*finds id of course that was in param
  Course.findByPk(req.params.id).then(function(course){
     if(course) {
       //*if course exists, return updated course
        if(req.currentUser.id == course.userId){
          course.update(req.body);
          res.status(204);
        }else{
          res.status(403);
        }
        
     } else {
       res.status(404);
     }
   }).then(function(course){
       res.send();      
   }).catch(function(error){
       //render edit form with errors
       if(error.name === "SequelizeValidationError") {
         var course = Course.build(req.body);
         course.id = req.params.id;
       } else {
         throw error;
       }
   }).catch(function(error){
       res.send(500, error);
    });
 });

//Deletes a course and returns no content
router.delete('/:id', authenticateUser, function(req, res, next) {
    //*finds id of course that was in param
   Course.findByPk(req.params.id).then(function(course){  
      //*if course exists, return updated course

    if(course) {
      if(req.currentUser.id == course.userId){
        course.destroy();
        res.status(204);
      }else{
        res.status(403);
      }
    } else {
      res.status(404);
    }
  }).then(function(){
    res.send();    
  }).catch(function(error){
      res.send(500, error);
   });
});

module.exports = router;