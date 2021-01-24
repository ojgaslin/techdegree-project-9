//*require express to write handlers for requests w/ different http verbs at different url paths
const express = require('express');
//*group route handlers together and access them using common route-prefix express.router
const router = express.Router();
//*import course.js under models 
var Course = require("../models").Course;

router.get('/api/courses', function(req, res, next) {

})

router.get('/api/courses/:id', function(req, res, next) {

})

router.post('/api/courses', function(req, res, next) {

})

router.put('/api/courses/:id', function(req, res, next) {

})

router.delete('/api/courses/:id', function(req, res, next) {
    
})