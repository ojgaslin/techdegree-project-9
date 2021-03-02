//*require express to write handlers for requests w/ different http verbs at different url paths
const express = require('express');
//*group route handlers together and access them using common route-prefix express.router
const router = express.Router();
//*import course.js under models 
var Course = require("../models").Course;

//*returns courses and the user that owns each course
router.get('/api/courses', function(req, res, next) {
   const courses = await Course.findAll({include: {model: User} });
    res.status(200).json(courses);
})
//*returns the course and course owner when given the course ID
router.get('/api/courses/:id', function(req, res, next) {
   const course = await Course.findByPk(req.params.id, {include: {model: User}});
    res.status(200).json(course);
})
//*creates a course and sets the location header to the URI for the course
router.post('/api/courses', function(req, res, next) {
   Course.create(req.body).then(function(course) {
   res.status(201).location(`/api/courses/${course.id}`);
   }).catch(function(error){
       if(error) {
         res.status(201).send(error);
       }
   })

})

router.put('/api/courses/:id', function(req, res, next) {
  console.log(req.params.id)
  //*finds id of course that was in param
  Course.findByPk(req.params.id).then(function(course){
     if(course) {
       //*if course exists, return updated course
       return course.update(req.body);
     } else {
       res.send(404);
     }
   }).then(function(course){
       res.send(204);      
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
router.delete('/api/courses/:id', function(req, res, next) {
    //*finds id of course that was in param
   Course.findByPk(req.params.id).then(function(course){  
    if(course) {
      return course.destroy();
    } else {
      res.send(404);
    }
  }).then(function(){
    res.send(204);    
  }).catch(function(error){
      res.send(500, error);
   });
});
